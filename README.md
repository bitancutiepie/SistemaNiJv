# SistemaNiJv (The Wimpy Credentials Book)

[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)](https://github.com/bitancutiepie/SistemaNiJv)

> A friendly, notebook-style student companion web app for managing classes, files, announcements, and daily campus life—all in one place.

**SistemaNiJv** is built for a close-knit group of students and class officers. Designed to look and feel like a hand-drawn sketchbook, it brings together your class schedule, shared reviewers, homework deadlines, and class chats without the clutter of complicated apps.

---

## What You Can Do

### For Students
- **Live Class Schedule** — Check your weekly timetable anytime and see a pulsing **"Happening Now"** indicator for your current class.
- **Resource Cabinet** — Find and download class reviewers, PDFs, images, and videos organized by subject.
- **Homework Tracker** — Keep track of upcoming assignments and deadlines right on your dashboard.
- **Interactive Calendar** — View upcoming class events, exams, and activities by month.
- **Freedom Wall** — Post and move around digital sticky notes with your classmates in real time.
- **Messaging & Group Chat** — Send private messages to classmates or hang out in the live group chat.
- **Mini-Games** — Take a break with built-in Creature Battles, Minesweeper, and Wordle.

### For Class Officers & Admins
- **Admin Tool Panel** — Easily add or update class schedules, homework, calendar events, and shared files.
- **Student Management** — Approve new student registrations, manage roles, and track enrollment.
- **Email & Live Broadcasts** — Send important announcements via email or pop-up alerts to everyone currently online.
- **File & Receipt Collection** — Organize class gallery photos, collect receipts, and monitor storage usage.

---

## Screenshots

| Auth & Memories Gallery | Member List & Fresh Drops |
|:---:|:---:|
| ![Landing 1](assets/screenshots/new/landing1.png) | ![Landing 2](assets/screenshots/new/landing2.png) |

| Recent Logins & Spotted | Memories Section |
|:---:|:---:|
| ![Landing 3](assets/screenshots/new/landing3.png) | ![Landing 4](assets/screenshots/new/landing4.png) |

| Admin Role Selection | Student Dashboard (The Binder) |
|:---:|:---:|
| ![Admin Choice](assets/screenshots/new/adminchoice.png) | ![Binder](assets/screenshots/new/binder.png) |

| Weekly Class Schedule | Real-time Freedom Wall |
|:---:|:---:|
| ![Schedule](assets/screenshots/new/schedule.png) | ![Freedom Wall](assets/screenshots/new/freedomwall.png) |

| Admin Management Tools | Digital Resource Cabinet |
|:---:|:---:|
| ![Admin Tools](assets/screenshots/new/admin_tools.png) | ![Resources](assets/screenshots/new/resources.png) |

---

## Want to Run Your Own Copy?

You can clone this repository to explore or host your own version. Note that private class data and our live database are not included, so you will need to connect your own [Supabase](https://supabase.com) project:

```bash
git clone https://github.com/bitancutiepie/SistemaNiJv.git
cd SistemaNiJv
npx serve .
```

1. Create a free project at [supabase.com](https://supabase.com).
2. Run `supabase-migration.sql` in your Supabase SQL Editor to set up the tables.
3. Enable Realtime for `messages` and `notes`, and create public storage buckets named `avatars` and `class-resources`.
4. Add your own `SUPABASE_URL` and `SUPABASE_KEY` in `js/config.js`.
5. Open `http://localhost:3000` in your browser.

---

**Built by Joshua Vincent Bitancor**
