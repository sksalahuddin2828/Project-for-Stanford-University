import math
import time
import random
from graphics import Canvas

SCREEN_WIDTH = 1500
SCREEN_HEIGHT = 1400

SUN_RADIUS = 55

# ---------------- SUN DATA ----------------
SUN = {
    "name": "Sun",
    "description": "The Sun is a G-type main-sequence star and the center of the Solar System.",
    "mass": "1.989 × 10^30 kg",
    "diameter": "1,392,700 km",
    "gravity": "274 m/s²",
    "distance": "0 km",
    "temperature": "5,500°C surface / 15 million°C core",
    "moons": 0,
}

PLANETS = [
    {
        "name": "Mercury",
        "radius": 8,
        "orbit_radius": 90,
        "speed": 0.04,
        "color": "gray",
        "mass": "3.30 × 10^23 kg",
        "diameter": "4,879 km",
        "gravity": "3.7 m/s²",
        "day_length": "58.6 Earth days",
        "year_length": "88 Earth days",
        "moons": 0,
        "distance": "57.9 million km",
        "temperature": "167°C",
        "description": "Smallest planet."
    },
    {
        "name": "Venus",
        "radius": 12,
        "orbit_radius": 130,
        "speed": 0.03,
        "color": "orange",
        "mass": "4.87 × 10^24 kg",
        "diameter": "12,104 km",
        "gravity": "8.87 m/s²",
        "day_length": "243 days",
        "year_length": "225 days",
        "moons": 0,
        "distance": "108.2 million km",
        "temperature": "464°C",
        "description": "Hottest planet."
    },
    {
        "name": "Earth",
        "radius": 14,
        "orbit_radius": 170,
        "speed": 0.025,
        "color": "blue",
        "mass": "5.97 × 10^24 kg",
        "diameter": "12,742 km",
        "gravity": "9.8 m/s²",
        "day_length": "24 hours",
        "year_length": "365 days",
        "moons": 1,
        "distance": "149.6 million km",
        "temperature": "15°C",
        "description": "Life exists here."
    },
    {
        "name": "Mars",
        "radius": 11,
        "orbit_radius": 210,
        "speed": 0.02,
        "color": "red",
        "mass": "6.39 × 10^23 kg",
        "diameter": "6,779 km",
        "gravity": "3.71 m/s²",
        "day_length": "24.6 hours",
        "year_length": "687 days",
        "moons": 2,
        "distance": "227.9 million km",
        "temperature": "-63°C",
        "description": "Red planet."
    },
    {
        "name": "Jupiter",
        "radius": 30,
        "orbit_radius": 280,
        "speed": 0.013,
        "color": "gold",
        "mass": "1.90 × 10^27 kg",
        "diameter": "139,820 km",
        "gravity": "24.79 m/s²",
        "day_length": "9.9 hours",
        "year_length": "11.9 years",
        "moons": 95,
        "distance": "778.5 million km",
        "temperature": "-108°C",
        "description": "Largest planet."
    },
    {
        "name": "Saturn",
        "radius": 28,
        "orbit_radius": 340,
        "speed": 0.010,
        "color": "tan",
        "mass": "5.68 × 10^26 kg",
        "diameter": "116,460 km",
        "gravity": "10.44 m/s²",
        "day_length": "10.7 hours",
        "year_length": "29.5 years",
        "moons": 146,
        "distance": "1.43 billion km",
        "temperature": "-139°C",
        "description": "Ring planet."
    },
    {
        "name": "Uranus",
        "radius": 24,
        "orbit_radius": 400,
        "speed": 0.007,
        "color": "cyan",
        "mass": "8.68 × 10^25 kg",
        "diameter": "50,724 km",
        "gravity": "8.69 m/s²",
        "day_length": "17.2 hours",
        "year_length": "84 years",
        "moons": 27,
        "distance": "2.87 billion km",
        "temperature": "-197°C",
        "description": "Side-rotating planet."
    },
    {
        "name": "Neptune",
        "radius": 24,
        "orbit_radius": 460,
        "speed": 0.005,
        "color": "blue",
        "mass": "1.02 × 10^26 kg",
        "diameter": "49,244 km",
        "gravity": "11.15 m/s²",
        "day_length": "16.1 hours",
        "year_length": "165 years",
        "moons": 14,
        "distance": "4.5 billion km",
        "temperature": "-201°C",
        "description": "Windy planet."
    },
    {
        "name": "Pluto",
        "radius": 6,
        "orbit_radius": 520,
        "speed": 0.003,
        "color": "white",
        "mass": "1.31 × 10^22 kg",
        "diameter": "2,377 km",
        "gravity": "0.62 m/s²",
        "day_length": "6.4 days",
        "year_length": "248 years",
        "moons": 5,
        "distance": "5.9 billion km",
        "temperature": "-229°C",
        "description": "Dwarf planet."
    }
]

# ---------------- STARS ----------------
def draw_stars(canvas, count=500):
    for _ in range(count):
        x = random.randint(0, SCREEN_WIDTH)
        y = random.randint(0, SCREEN_HEIGHT)
        size = random.choice([1, 1, 2])
        color = random.choice(["white", "light gray", "gray"])

        canvas.create_oval(x, y, x + size, y + size, color)

# ---------------- INFO PANEL ----------------
def draw_info_panel(canvas, data):
    text = (
        f"🌌 {data['name']}\n\n"
        f"{data['description']}\n\n"
        f"Mass: {data['mass']}\n"
        f"Diameter: {data['diameter']}\n"
        f"Gravity: {data['gravity']}\n"
        f"Distance: {data['distance']}\n"
        f"Moons: {data['moons']}\n"
        f"Temperature: {data['temperature']}"
    )
    return canvas.create_text(20, 20, text=text, font="Arial", color="white")

# ---------------- POSITION ----------------
def get_position(planet, angle):
    x = SCREEN_WIDTH // 2 + math.cos(angle) * planet["orbit_radius"]
    y = SCREEN_HEIGHT // 2 + math.sin(angle) * planet["orbit_radius"]
    return x, y

# ---------------- MAIN ----------------
def main():
    canvas = Canvas(SCREEN_WIDTH, SCREEN_HEIGHT)

    # background
    canvas.create_rectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "black")

    # stars
    draw_stars(canvas, 600)

    # SUN position
    sun_x = SCREEN_WIDTH // 2
    sun_y = SCREEN_HEIGHT // 2

    # SUN draw
    canvas.create_oval(
        sun_x - SUN_RADIUS,
        sun_y - SUN_RADIUS,
        sun_x + SUN_RADIUS,
        sun_y + SUN_RADIUS,
        "yellow"
    )

    canvas.create_text(
        sun_x,
        sun_y - SUN_RADIUS - 20,
        text="SUN",
        font="Arial",
        color="yellow"
    )

    # planets
    planets = []
    for p in PLANETS:
        obj = canvas.create_oval(
            0, 0,
            p["radius"] * 2,
            p["radius"] * 2,
            p["color"]
        )

        planets.append({
            "data": p,
            "angle": random.uniform(0, math.pi * 2),
            "obj": obj,
            "label": None
        })

    info_panel = None

    # LOOP
    while True:
        time.sleep(0.04)

        click = canvas.get_last_click()

        # ---------------- CLICK SYSTEM ----------------
        if click:
            cx, cy = click

            if info_panel:
                canvas.delete(info_panel)

            # SUN click FIX
            if (cx - sun_x) ** 2 + (cy - sun_y) ** 2 <= SUN_RADIUS ** 2:
                info_panel = draw_info_panel(canvas, SUN)

            # PLANETS click
            for planet in planets:
                p = planet["data"]
                x, y = get_position(p, planet["angle"])

                if abs(cx - x) < p["radius"] and abs(cy - y) < p["radius"]:
                    info_panel = draw_info_panel(canvas, p)

        # ---------------- MOVE PLANETS ----------------
        for planet in planets:
            p = planet["data"]

            planet["angle"] += p["speed"]

            x, y = get_position(p, planet["angle"])

            canvas.moveto(
                planet["obj"],
                x - p["radius"],
                y - p["radius"]
            )

            if planet["label"]:
                canvas.delete(planet["label"])

            planet["label"] = canvas.create_text(
                x,
                y - p["radius"] - 10,
                text=p["name"],
                font="Arial",
                color="white"
            )

if __name__ == "__main__":
    main()