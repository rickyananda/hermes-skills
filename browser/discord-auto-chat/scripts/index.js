import fetch from 'node-fetch';
import readline from 'readline-sync';
import fs from 'fs';
import chalk from 'chalk';

// ============================================
// DISCORD AUTO CHAT v2.0 - Human-Like Edition
// Original by NT-Exhaust, Enhanced version
// ============================================

// --- Config ---
const DISCORD_API = 'https://discord.com/api/v9';
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

// --- Banner ---
console.log(chalk.cyan.bold('\n╔══════════════════════════════════════════╗'));
console.log(chalk.cyan.bold('║  DISCORD AUTO CHAT v2.0 - Human-Like    ║'));
console.log(chalk.cyan.bold('║  Enhanced by Hermes Agent                ║'));
console.log(chalk.cyan.bold('╚══════════════════════════════════════════╝\n'));

// --- Input ---
const channelIds = readline.question(chalk.yellow('[?] Channel IDs (comma separated): ')).split(',').map(id => id.trim()).filter(Boolean);
const mode = readline.question(chalk.yellow('[?] Mode (1=auto-chat, 2=reply-chain, 3=lurk+chat): ')) || '1';
const minDelay = parseInt(readline.question(chalk.yellow('[?] Min delay between messages (sec, default 8): ') || '8')) * 1000;
const maxDelay = parseInt(readline.question(chalk.yellow('[?] Max delay between messages (sec, default 25): ') || '25')) * 1000;
const deleteOption = readline.question(chalk.yellow('[?] Delete messages after send? (y/n): ')).toLowerCase() === 'y';

let deleteDelay = 0;
if (deleteOption) {
    deleteDelay = parseInt(readline.question(chalk.yellow('[?] Delete after (sec, default 30): ') || '30')) * 1000;
}

// Load tokens
const tokens = fs.readFileSync('token.txt', 'utf-8').split('\n').map(t => t.trim()).filter(Boolean);
if (!tokens.length) {
    console.log(chalk.red('[!] No tokens found in token.txt'));
    process.exit(1);
}
console.log(chalk.green(`[✔] Loaded ${tokens.length} token(s)`));

// --- Human-like utilities ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Simulate human typing delay (chars have variable timing)
const humanDelay = () => {
    // Base: random between min/max, but with occasional long pauses (thinking)
    const base = randomBetween(minDelay, maxDelay);
    // 15% chance of "thinking" pause (2-4x longer)
    if (Math.random() < 0.15) return base * randomBetween(2, 4);
    // 5% chance of quick burst (0.3-0.7x)
    if (Math.random() < 0.05) return Math.floor(base * (0.3 + Math.random() * 0.4));
    return base;
};

// Typing indicator simulation
const sendTyping = async (channelId, token) => {
    try {
        await fetch(`${DISCORD_API}/channels/${channelId}/typing`, {
            method: 'POST',
            headers: { 'Authorization': token, 'User-Agent': USER_AGENT }
        });
    } catch {}
};

// Simulate human typing (show indicator for realistic duration)
const simulateTyping = async (channelId, token, messageLength) => {
    // Average typing speed: 200-350ms per char, with bursts
    const baseTime = messageLength * randomBetween(150, 400);
    // Add "thinking" time
    const thinkTime = randomBetween(500, 3000);
    const totalTyping = Math.min(baseTime + thinkTime, 8000); // Cap at 8s

    await sendTyping(channelId, token);
    // Re-trigger typing indicator every 8s (Discord timeout)
    const intervals = Math.ceil(totalTyping / 7000);
    for (let i = 0; i < intervals; i++) {
        await sleep(Math.min(totalTyping - (i * 7000), 7000));
        if (i < intervals - 1) await sendTyping(channelId, token);
    }
};

// --- Message Fetching ---
const fetchMessages = async (channelId, token, limit = 50) => {
    try {
        const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages?limit=${limit}`, {
            headers: { 'Authorization': token, 'User-Agent': USER_AGENT }
        });
        if (res.ok) return await res.json();
        if (res.status === 429) {
            const retry = (await res.json()).retry_after * 1000;
            console.log(chalk.yellow(`[⏳] Rate limited, waiting ${retry}ms`));
            await sleep(retry);
            return fetchMessages(channelId, token, limit);
        }
    } catch (e) {
        console.log(chalk.red(`[!] Fetch error: ${e.message}`));
    }
    return [];
};

// --- Message Generation (Human-like) ---
const messagePool = {
    reactions: ['lol', 'lmao', 'nice', 'fr', 'based', 'real', 'ong', 'true', 'nah', 'yep', 'ok', 'gg', 'wp'],
    filler: ['tbh', 'ngl', 'imo', 'lowkey', 'highkey', 'deadass', 'no cap', 'fr fr', 'sheesh', 'bruh'],
    questions: ['wdym?', 'wdym', 'wym', 'huh', 'what', 'wdhym', 'really?', 'for real?', 'nah fr?', 'you serious?'],
    agreement: ['yeah', 'yep', 'ye', 'ya', 'true', 'fr', 'facts', 'exactly', 'right', 'correct'],
    laughing: ['😂', '🤣', '💀', 'lmao', 'lmfao', 'rofl', 'lol', 'HAHA', 'haha', 'heh'],
    emoji: ['💀', '😂', '🔥', '💯', '👀', '🤔', '😤', '🗿', '👍', '😅', '🫡', '😎'],
};

// Generate a human-like message based on context
const generateMessage = async (channelId, token) => {
    const messages = await fetchMessages(channelId, token);
    if (!messages.length) return randomChoice(messagePool.reactions);

    // Analyze recent messages for context
    const recentContent = messages.filter(m => m.content).map(m => m.content);
    const lastMsg = recentContent[0] || '';

    // Different strategies based on probability
    const strategy = Math.random();

    // Strategy 1: React to recent message (40%)
    if (strategy < 0.40) {
        const base = randomChoice(recentContent);
        if (base.length < 3) return base;

        // Various transformations
        const transform = Math.random();
        if (transform < 0.3) {
            // Truncate + add reaction
            const words = base.split(' ');
            const truncated = words.slice(0, Math.max(2, Math.floor(words.length * 0.6))).join(' ');
            return truncated + ' ' + randomChoice(messagePool.emoji);
        } else if (transform < 0.5) {
            // Just an emoji reaction
            return randomChoice(messagePool.emoji);
        } else if (transform < 0.7) {
            // Agree with something
            return randomChoice(messagePool.agreement) + ' ' + randomChoice(messagePool.emoji);
        } else {
            // Modify the message slightly
            return mutateMessage(base);
        }
    }

    // Strategy 2: Short reaction (25%)
    if (strategy < 0.65) {
        const type = Math.random();
        if (type < 0.3) return randomChoice(messagePool.laughing);
        if (type < 0.5) return randomChoice(messagePool.reactions);
        if (type < 0.7) return randomChoice(messagePool.filler) + ' ' + randomChoice(messagePool.emoji);
        if (type < 0.85) return randomChoice(messagePool.questions);
        return randomChoice(messagePool.emoji);
    }

    // Strategy 3: Copy + mutate existing message (20%)
    if (strategy < 0.85) {
        const base = randomChoice(recentContent);
        if (base.length > 1) return mutateMessage(base);
        return randomChoice(messagePool.reactions);
    }

    // Strategy 4: Random pool message (15%)
    return randomChoice([
        ...messagePool.reactions,
        ...messagePool.laughing,
        ...messagePool.filler,
    ]);
};

// Mutate a message to seem natural
const mutateMessage = (msg) => {
    const mutations = [
        // Remove a random character
        () => {
            if (msg.length < 3) return msg;
            const i = Math.floor(Math.random() * msg.length);
            return msg.slice(0, i) + msg.slice(i + 1);
        },
        // Swap two adjacent chars
        () => {
            if (msg.length < 4) return msg;
            const i = Math.floor(Math.random() * (msg.length - 1));
            return msg.slice(0, i) + msg[i+1] + msg[i] + msg.slice(i+2);
        },
        // Lowercase everything
        () => msg.toLowerCase(),
        // Add emoji at end
        () => msg + ' ' + randomChoice(messagePool.emoji),
        // Truncate
        () => {
            const words = msg.split(' ');
            return words.slice(0, Math.max(1, Math.floor(words.length * 0.7))).join(' ');
        },
        // Repeat a word
        () => {
            const words = msg.split(' ');
            if (words.length < 2) return msg;
            const i = Math.floor(Math.random() * words.length);
            words.splice(i, 0, words[i]);
            return words.join(' ');
        },
    ];
    return randomChoice(mutations)();
};

// --- Send Message ---
const sendMessage = async (channelId, content, token) => {
    try {
        // Simulate typing first
        await simulateTyping(channelId, token, content.length);

        const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': USER_AGENT,
            },
            body: JSON.stringify({ content })
        });

        if (res.ok) {
            const data = await res.json();
            console.log(chalk.green(`[✔] Sent → ${channelId}: "${content}"`));

            // Delete if enabled
            if (deleteOption) {
                await sleep(deleteDelay + randomBetween(-2000, 5000));
                await deleteMessage(channelId, data.id, token);
            }
            return data.id;
        } else if (res.status === 429) {
            const retry = (await res.json()).retry_after * 1000;
            console.log(chalk.yellow(`[⏳] Rate limited, waiting ${retry}ms`));
            await sleep(retry);
            return sendMessage(channelId, content, token);
        } else {
            const err = await res.text();
            console.log(chalk.red(`[✘] Failed ${res.status}: ${err}`));
        }
    } catch (e) {
        console.log(chalk.red(`[!] Send error: ${e.message}`));
    }
    return null;
};

// --- Delete Message ---
const deleteMessage = async (channelId, messageId, token) => {
    try {
        const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages/${messageId}`, {
            method: 'DELETE',
            headers: { 'Authorization': token, 'User-Agent': USER_AGENT }
        });
        if (res.ok) {
            console.log(chalk.blue(`[🗑] Deleted ${messageId}`));
        }
    } catch {}
};

// --- Main Loop ---
const stats = { sent: 0, deleted: 0, errors: 0, startTime: Date.now() };

const printStats = () => {
    const runtime = Math.floor((Date.now() - stats.startTime) / 1000);
    const mins = Math.floor(runtime / 60);
    const secs = runtime % 60;
    console.log(chalk.gray(`\n[📊] Stats: ${stats.sent} sent | ${stats.deleted} deleted | ${stats.errors} errors | Runtime: ${mins}m${secs}s\n`));
};

(async () => {
    console.log(chalk.cyan('\n[🚀] Starting auto-chat...\n'));

    // Print stats every 5 minutes
    setInterval(printStats, 5 * 60 * 1000);

    let tokenIndex = 0;

    while (true) {
        for (const channelId of channelIds) {
            const token = tokens[tokenIndex % tokens.length];
            tokenIndex++;

            try {
                // Random "lurk" behavior (10% chance - just read, don't send)
                if (Math.random() < 0.10) {
                    console.log(chalk.gray(`[👀] Lurking in ${channelId} (skipping this round)`));
                    await sleep(randomBetween(3000, 8000));
                    continue;
                }

                const message = await generateMessage(channelId, token);
                if (!message || message.trim().length === 0) continue;

                await sendMessage(channelId, message, token);
                stats.sent++;

            } catch (e) {
                stats.errors++;
                console.log(chalk.red(`[!] Error: ${e.message}`));
            }

            // Human-like delay between messages
            const delay = humanDelay();
            console.log(chalk.gray(`[⏳] Next message in ${(delay / 1000).toFixed(1)}s`));
            await sleep(delay);
        }

        // Random longer pause between cycles (simulates user going AFK)
        if (Math.random() < 0.20) {
            const afkTime = randomBetween(30000, 120000);
            console.log(chalk.magenta(`[😴] Taking a break for ${(afkTime / 1000).toFixed(0)}s (simulating AFK)`));
            await sleep(afkTime);
        }
    }
})();
