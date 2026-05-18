# Building Android APKs Without Gradle

When Gradle dependency resolution hangs or fails (common in CI, containers, limited bandwidth), build APKs manually using the Android SDK command-line tools.

## Prerequisites
- Android SDK with: `build-tools;34.0.0`, `platforms;android-34`, `platform-tools`
- Java 17+
- Install: `sdkmanager "platforms;android-34" "build-tools;34.0.0" "platform-tools"`

## Build Steps

```bash
export ANDROID_HOME=~/android-sdk
export BUILD_TOOLS=$ANDROID_HOME/build-tools/34.0.0
export PLATFORM=$ANDROID_HOME/platforms/android-34/android.jar
export PROJECT=/path/to/project
export SRC=$PROJECT/app/src/main
export OUT=$PROJECT/build

rm -rf $OUT && mkdir -p $OUT/gen $OUT/obj $OUT/apk

# 1. Compile resources
$BUILD_TOOLS/aapt2 compile --dir $SRC/res -o $OUT/compiled.zip

# 2. Link resources + generate R.java
$BUILD_TOOLS/aapt2 link -o $OUT/apk/app.unsigned.apk \
  -I $PLATFORM --manifest $SRC/AndroidManifest.xml \
  --java $OUT/gen --auto-add-overlay $OUT/compiled.zip

# 3. Compile Java (include generated R.java)
find $SRC/java -name "*.java" > $OUT/sources.txt
find $OUT/gen -name "*.java" >> $OUT/sources.txt
javac -source 1.8 -target 1.8 -classpath $PLATFORM -d $OUT/obj @$OUT/sources.txt

# 4. Convert to DEX
$BUILD_TOOLS/d8 --output $OUT/apk/ --lib $PLATFORM $(find $OUT/obj -name "*.class")

# 5. Package APK
mkdir -p $OUT/apk/tmp && cd $OUT/apk/tmp
unzip -q -o ../app.unsigned.apk
cp ../classes.dex .
# Copy assets if any
cp -r $SRC/assets/* . 2>/dev/null
cd ..
rm -f app-unsigned.zip
cd tmp && zip -r -q ../app-unsigned.zip . && cd ..
$BUILD_TOOLS/zipalign -f 4 app-unsigned.zip app.aligned.apk

# 6. Sign
keytool -genkey -v -keystore debug.keystore \
  -storepass android -keypass android \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias debug -dname "CN=Debug,O=Debug,C=US" 2>/dev/null

$BUILD_TOOLS/apksigner sign --ks debug.keystore \
  --ks-pass pass:android --key-pass pass:android \
  --out app-signed.apk app.aligned.apk

ls -lh app-signed.apk
```

## Common Pitfalls

### Theme references AppCompat
If `AndroidManifest.xml` references `Theme.AppCompat.NoActionBar`, aapt2 will fail because AppCompat isn't available without Gradle. Fix: use `android:Theme.Material.NoActionBar` (API 21+) instead.

### zipalign on directory
`zipalign` needs a zip file, not a directory. Always `zip` the directory contents first, then `zipalign` the zip.

### Missing R.java
If aapt2 link fails, R.java won't be generated and javac will fail with "cannot find symbol R". Fix the aapt2 error first (usually a missing resource or wrong theme reference).

### Java version mismatch
SDK cmdline-tools (2024+) require Java 17. Install: `sudo apt-get install openjdk-17-jdk`

### Keystore not found
Generate the keystore BEFORE running apksigner. The `keytool` command creates it.

## When to Use This
- Gradle dependency download hangs (no internet, slow connection, proxy issues)
- Minimal APK without external dependencies (no AndroidX, no libraries)
- CI/CD environments where Gradle is too heavy
- Quick prototyping when you just need a WebView wrapper

## Limitations
- No dependency management (must compile everything from source or use base Android APIs)
- No ProGuard/R8 minification
- No build variants (debug/release must be done manually)
- Larger APK since no tree-shaking
