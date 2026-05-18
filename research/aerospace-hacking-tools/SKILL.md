---
name: aerospace-hacking-tools
description: Curated collection of aerospace & space cybersecurity tools — satellite tracking, radio astronomy, OSINT, astrodynamics, simulations, and UAV/Drone ops. Sourced from tools.g4lxy.space (by Angelina Tsuboi).
tags: [aerospace, satellites, osint, radio, astronomy, hacking, space, drones, uav]
---

# Aerospace Hacking Tools

A comprehensive collection of space-related cybersecurity and hacking tools.
Source: https://tools.g4lxy.space

## Categories

| Category | Emoji | Description |
|---|---|---|
| Astrodynamics | ☄️ | Orbital mechanics, trajectory computation |
| Astronomy | 🔭 | Planetarium, sky visualization, catalogs |
| Avionics | ✈️ | Aircraft electronics & systems |
| Digital Forensics | 🔍 | Space-related forensics |
| Drones | 🚁 | UAV/Drone operations |
| Earth | 🌍 | Earth observation & remote sensing |
| Ground Control | 🎮 | Satellite/mission control systems |
| Ground Stations | 📡 | Receiving stations for satellite data |
| Launches | 🎆 | Rocket launch tracking & telemetry |
| Mission Control | 🎮 | Mission operations |
| Mission Design | ✏️ | Mission planning & design |
| OSINT | 🕵️‍♂️ | Open-source intelligence for space assets |
| Planetary Defense | 🌍 | Asteroid/NEO monitoring |
| Planets | 🪐 | Planetary data & visualization |
| Radio | 📻 | Radio astronomy & satellite comms |
| Satellites | 🛰️ | Satellite tracking, TLE, telemetry |
| Simulation | 🎮 | Space & flight simulations |
| Spacecraft | 🚀 | Spacecraft ops & design |
| Star Trackers | ✨ | Star identification & tracking |
| UAV | 🛸 | Unmanned aerial vehicles |

## Tools Reference

### Satellite Tracking & OSINT

- **TinyGS** — Open global network of Ground Stations for LoRa satellites, weather probes, using cheap modules
  - Categories: Satellites, Ground Stations
  - URL: https://tinygs.com

- **SatNOGS** — Open source global satellite ground-station network
  - Categories: Satellites, Ground Stations
  - URL: https://satnogs.org

- **Orbitron** — Satellite tracking system for radio amateur & observing
  - Categories: Satellites, OSINT, Radio

- **SatIntel** — OSINT tool for satellites: extract telemetry, orbital predictions, parse TLEs
  - Categories: Satellites, OSINT

- **Satellite.Js** — Modular SGP4/SDP4 TLE propagation functions (JavaScript)
  - Category: Satellites

- **Python SGP4** — Python SGP4 satellite position library
  - Category: Satellites

- **CCSDSPy** — Python package for reading CCSDS packet data
  - Categories: Satellites, OSINT

- **SOLM** — Satellite Operations Language Meta-model for spacecraft ops procedures
  - Category: Satellites

- **SatFlare** — Generic satellite data processing software
  - Categories: Radio, Satellites

### Astronomy & Visualization

- **Stellarium** — Desktop planetarium with realistic 3D sky
  - Categories: Astronomy, Star Trackers

- **Astrocats** — Open Astronomy Catalogs
  - Categories: Planets, Astronomy

- **Astrometry.Net** — Astrometric calibration metadata for astronomical imaging
  - Categories: Star Trackers, Astronomy

- **Virgo** — Versatile spectrometer for radio astronomy
  - Categories: Radio, Astronomy

- **100,000 Stars** — Interactive visualization of 119,617 nearby stars
  - Categories: Star Trackers, Astronomy

- **KStars** — Feature-rich free astronomy software
  - Categories: Simulation, Astronomy

- **NEODyS-2** — Near-Earth Asteroids (NEAs) info & services
  - Categories: Near Earth Objects, Asteroids, OSINT

### Astrodynamics & Simulation

- **Harmony Of The Spheres** — Newtonian n-body gravity simulator
  - Categories: Simulation, Astrodynamics

- **Orbit Simulator** — N-body gravitational simulation via numerical integration
  - Categories: Astrodynamics, Planets

- **Poliastro** — Python library for Astrodynamics & Orbital Mechanics
  - Category: Astrodynamics

- **Skyfield** — Compute positions for stars, planets, and Earth-orbit satellites
  - Categories: Astrodynamics, Astronomy

- **Mars Now** — Visualization of Mars spacecraft data via NASA Mars Relay Network
  - Categories: Simulation, Planets

- **NASA Eyes** — Immersive simulations of Earth, solar system, universe & spacecraft
  - Categories: Star Trackers, Planets

### Spacecraft & Launches

- **SpaceXTelemetry API** — Open source REST API for rocket launch telemetry & predictions
  - Categories: Spacecraft, Launches

- **OpenTsiolkovsky** — Rocket flight simulator
  - Categories: Spacecraft, Simulation

- **ISS Docking Simulator** — Pilot SpaceX Dragon 2 to ISS using real NASA controls
  - Categories: Spacecraft, Simulation

### Radio & SSTV

- **MMSSTV** — Transmit/receive SSTV via PC soundcard
  - Categories: Satellites, Radio

### Earth & Remote Sensing

- **Satpy** — Python library for remote sensing data (read/write various formats)
  - Categories: Satellites, OSINT

- **Cesium** — Open platform for 3D data applications
  - Categories: Earth, OSINT

## Key Python Libraries

For programmatic space/satellite work:

```bash
# Satellite position from TLE
pip install sgp4

# Astrodynamics & orbital mechanics
pip install poliastro

# Star/planet/satellite positions
pip install skyfield

# Remote sensing data
pip install satpy

# CCSDS packet parsing
pip install ccsdspy
```

## Use Cases

- **Satellite OSINT**: SatIntel, Orbitron, Satpy, CCSDSPy
- **Ground Station Ops**: TinyGS, SatNOGS
- **Radio Hacking**: MMSSTV, Virgo, SatFlare
- **Astronomy Observation**: Stellarium, KStars, Astrometry.Net
- **Orbital Simulation**: Poliastro, Skyfield, Orbit Simulator, Harmony Of The Spheres
- **Spacecraft Ops**: SpaceXTelemetry API, ISS Docking Simulator, OpenTsiolkovsky
- **NEO/Planetary Defense**: NEODyS-2
- **Earth OSINT**: Cesium, Satpy
