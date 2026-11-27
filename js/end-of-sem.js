// End of Sem To-Do popup: subject-grouped & deadline-sorted views with localStorage persistence.
const END_OF_SEM_STORAGE_KEY = 'end_of_sem_done_v1';
let endOfSemViewMode = 'subject'; // 'subject' | 'deadline'
let endOfSemHideDone = false;

const END_OF_SEM_SUBJECTS = [
    {
        id: 'sam',
        subject: 'SAM',
        color: '#ff7675',
        items: [{ id: 'sam-lab', title: 'Lab Final', due: 'Nov 28, 7–9 AM', urgency: 'urgent', sortKey: 1, note: '' }],
    },
    {
        id: 'wst',
        subject: 'WST',
        color: '#fab1a0',
        items: [
            { id: 'wst-proj', title: 'Final Project', due: 'Dec 2, 4–7 PM', urgency: 'urgent', sortKey: 2, note: 'Defense / presentation' },
            { id: 'wst-exam', title: 'Final Exam', due: '2nd week of Dec', urgency: 'upcoming', sortKey: 6, note: '' },
        ],
    },
    {
        id: 'bat402',
        subject: 'BAT402',
        color: '#a29bfe',
        items: [
            { id: 'bat402-proj', title: 'Final Project', due: 'Dec 4, 1:00 PM', urgency: 'urgent', sortKey: 3, note: '' },
            { id: 'bat402-exam', title: 'Final Exam', due: '2nd week of Dec', urgency: 'upcoming', sortKey: 6, note: '' },
            {
                id: 'bat402-act3',
                title: 'Activity 3',
                due: 'Finals',
                urgency: 'muted',
                sortKey: 8,
                tag: 'Conditional',
                note: 'Covered by Final Exam if satisfactory score',
            },
        ],
    },
    {
        id: 'sia',
        subject: 'SIA',
        color: '#74b9ff',
        items: [
            { id: 'sia-proj', title: 'Final Project', due: 'TBA', urgency: 'muted', sortKey: 9, note: '' },
            {
                id: 'sia-exam',
                title: 'Final Exam',
                due: '2nd week of Dec',
                urgency: 'upcoming',
                sortKey: 6,
                tag: 'Conditional',
                note: 'TBA: Exempt if good Final Project',
            },
        ],
    },
    {
        id: 'bat401',
        subject: 'BAT401',
        color: '#81ecec',
        items: [
            {
                id: 'bat401-proj',
                title: 'Final Project',
                due: 'Dec 11',
                urgency: 'upcoming',
                sortKey: 4,
                note: 'Dashboard presentation, written report, and paper (Part 1 & Part 2)',
            },
        ],
    },
    {
        id: 'sad',
        subject: 'SAD',
        color: '#fdcb6e',
        items: [{ id: 'sad-proj', title: 'Final Project', due: 'Dec 20', urgency: 'upcoming', sortKey: 7, note: '' }],
    },
    {
        id: 'ethics',
        subject: 'Ethics',
        color: '#ffeaa7',
        items: [
            { id: 'ethics-case', title: 'Case Study Paper Final', due: 'TBA', urgency: 'muted', sortKey: 9, tag: 'Waiting', note: 'No news yet' },
            { id: 'ethics-quiz', title: 'Long Quiz', due: 'TBA', urgency: 'muted', sortKey: 9, tag: 'Waiting', note: 'No news yet' },
        ],
    },
    {
        id: 'others',
        subject: 'Others',
        color: '#55efc4',
        items: [
            { id: 'other-eval', title: 'Teacher Eval', due: 'Until Dec 13', urgency: 'upcoming', sortKey: 5, note: '' },
            { id: 'other-sn', title: 'ServiceNow 7 Courses', due: 'Until Dec 13', urgency: 'upcoming', sortKey: 5, note: '' },
        ],
    },
];

function getEndOfSemDone() {
    try {
        return JSON.parse(localStorage.getItem(END_OF_SEM_STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function closeEndOfSemPopup() {
    const el = document.getElementById('end-of-sem-overlay');
    if (el) el.remove();
}

function setEndOfSemView(mode) {
    endOfSemViewMode = mode;
    showEndOfSemPopup(false);
}

function toggleEndOfSemHideDone() {
    endOfSemHideDone = !endOfSemHideDone;
    showEndOfSemPopup(false);
}

function toggleEndOfSemItem(id) {
    const done = getEndOfSemDone();
    done[id] = !done[id];
    localStorage.setItem(END_OF_SEM_STORAGE_KEY, JSON.stringify(done));
    const scrollEl = document.getElementById('end-of-sem-scroll');
    const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
    showEndOfSemPopup(false);
    const newScrollEl = document.getElementById('end-of-sem-scroll');
    if (newScrollEl) newScrollEl.scrollTop = scrollTop;
}

function renderUrgencyBadge(due, urgency) {
    if (urgency === 'urgent') {
        return `<span style="display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:999px;background:#ffe5e5;color:#d63031;border:1px solid #fab1a0;white-space:nowrap;flex-shrink:0;"><span class="eos-pulse-dot" style="width:6px;height:6px;border-radius:50%;background:#d63031;"></span>${due}</span>`;
    }
    if (urgency === 'upcoming') {
        return `<span style="font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:999px;background:#fff4db;color:#b45309;border:1px solid #fde68a;white-space:nowrap;flex-shrink:0;">${due}</span>`;
    }
    return `<span style="font-size:0.72rem;font-weight:600;padding:2px 8px;border-radius:999px;background:#f1f5f9;color:#64748b;border:1px dashed #cbd5e1;white-space:nowrap;flex-shrink:0;">${due}</span>`;
}

function renderTaskRow(item, isDone, isLast, subjectPillHtml) {
    const isMuted = item.urgency === 'muted';
    return `
        <label class="eos-row" style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;cursor:pointer;${isLast ? '' : 'border-bottom:1px solid rgba(15,23,42,0.07);'}${isMuted && !isDone ? 'opacity:0.78;' : ''}">
            <input type="checkbox" class="eos-checkbox" ${isDone ? 'checked' : ''} onchange="toggleEndOfSemItem('${item.id}')" style="margin-top:3px;width:16px;height:16px;flex-shrink:0;accent-color:#00b894;cursor:pointer;" />
            <div style="flex:1;min-width:0;overflow-wrap:anywhere;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        ${subjectPillHtml || ''}
                        <span style="font-weight:700;font-size:0.9rem;line-height:1.3;color:#1e293b;transition:opacity 0.15s;${isDone ? 'text-decoration:line-through;opacity:0.5;' : ''}">${item.title}</span>
                        ${item.tag ? `<span style="font-size:0.68rem;font-weight:600;padding:1px 6px;border-radius:999px;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;">${item.tag}</span>` : ''}
                    </div>
                    ${renderUrgencyBadge(item.due, item.urgency)}
                </div>
                ${item.note ? `<div style="font-size:12px;color:#6b7280;margin-top:3px;line-height:1.35;">${item.note}</div>` : ''}
            </div>
        </label>
    `;
}

function showEndOfSemPopup(animate = true) {
    const done = getEndOfSemDone();
    const total = END_OF_SEM_SUBJECTS.reduce((sum, s) => sum + s.items.length, 0);
    const completed = END_OF_SEM_SUBJECTS.reduce(
        (sum, s) => sum + s.items.filter((item) => done[item.id]).length,
        0,
    );
    const pct = total ? Math.round((completed / total) * 100) : 0;

    let bodyHtml = '';
    if (endOfSemViewMode === 'subject') {
        const cardsHtml = END_OF_SEM_SUBJECTS.map((group, cardIdx) => {
            const subDone = group.items.filter((i) => done[i.id]).length;
            const visibleItems = endOfSemHideDone ? group.items.filter((i) => !done[i.id]) : group.items;
            if (endOfSemHideDone && visibleItems.length === 0) return '';
            const rows = visibleItems
                .map((item, idx) => renderTaskRow(item, !!done[item.id], idx === visibleItems.length - 1, ''))
                .join('');
            const animStyle = animate ? `animation: eosCardIn 200ms cubic-bezier(0.22,1,0.36,1) ${cardIdx * 30}ms both;` : '';
            return `
                <div class="eos-card" style="margin:0;width:100%;box-sizing:border-box;padding:12px 14px;display:flex;flex-direction:column;border:1.5px solid rgba(255,255,255,0.85);border-radius:14px;background:rgba(255,255,255,0.62);box-shadow:0 6px 20px rgba(0,0,0,0.06);${animStyle}">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">
                        <span style="background:${group.color};color:#1e293b;padding:2px 10px;border-radius:6px;font-weight:800;font-size:0.8rem;border:1px solid #1e293b;">${group.subject}</span>
                        <span style="font-size:0.75rem;font-weight:600;color:#64748b;">${subDone}/${group.items.length} done</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.88);border-radius:10px;border:1px solid rgba(15,23,42,0.08);overflow:hidden;">
                        ${rows}
                    </div>
                </div>
            `;
        }).join('');
        const emptyMsg = '<div style="grid-column:1/-1;text-align:center;padding:28px;color:#475569;font-weight:700;">All tasks completed!</div>';
        bodyHtml = `<div id="end-of-sem-scroll" class="eos-scroll" style="overflow-y:auto;padding:2px 6px 4px 2px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;align-items:stretch;">${cardsHtml || emptyMsg}</div>`;
    } else {
        const flat = END_OF_SEM_SUBJECTS.flatMap((g) =>
            g.items.map((item) => ({ ...item, subject: g.subject, color: g.color })),
        )
            .filter((item) => (!endOfSemHideDone ? true : !done[item.id]))
            .sort((a, b) => a.sortKey - b.sortKey);
        const rows = flat
            .map((item, idx) => {
                const pill = `<span style="background:${item.color};color:#1e293b;padding:1px 7px;border-radius:5px;font-weight:800;font-size:0.72rem;border:1px solid #1e293b;">${item.subject}</span>`;
                return renderTaskRow(item, !!done[item.id], idx === flat.length - 1, pill);
            })
            .join('');
        const emptyMsg = '<div style="text-align:center;padding:28px;color:#475569;font-weight:700;">All tasks completed!</div>';
        bodyHtml = `<div id="end-of-sem-scroll" class="eos-scroll" style="overflow-y:auto;padding:2px 6px 4px 2px;"><div style="background:rgba(255,255,255,0.88);border-radius:12px;border:1px solid rgba(15,23,42,0.08);overflow:hidden;">${rows || emptyMsg}</div></div>`;
    }

    const modalAnim = animate ? 'animation: eosModalIn 220ms cubic-bezier(0.22,1,0.36,1) both;' : '';
    const html = `
        <div id="end-of-sem-overlay" class="wimpy-modal-overlay" onclick="if(event.target===this)closeEndOfSemPopup()">
            <style>
                @keyframes eosModalIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes eosCardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes eosPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.35); opacity: 0.65; } }
                @keyframes eosShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px) rotate(-2deg); } 50% { transform: translateX(3px) rotate(2deg); } 75% { transform: translateX(-2px) rotate(-1deg); } }
                .eos-pulse-dot { animation: eosPulse 1.8s ease-in-out infinite; }
                .eos-row { transition: background 0.15s ease; }
                .eos-row:hover { background: rgba(241, 245, 249, 0.78); }
                .eos-checkbox:checked { animation: eosShake 0.28s ease; }
                .eos-btn:active { animation: eosShake 0.28s ease; }
                .eos-scroll::-webkit-scrollbar { width: 6px; }
                .eos-scroll::-webkit-scrollbar-track { background: transparent; }
                .eos-scroll::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.18); border-radius: 999px; }
            </style>
            <div class="wimpy-modal" style="max-width:900px;width:94%;max-height:86vh;padding:20px 22px;display:flex;flex-direction:column;background:rgba(255,255,255,0.75);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1.5px solid rgba(255,255,255,0.85);box-shadow:0 18px 45px rgba(0,0,0,0.18);border-radius:18px;box-sizing:border-box;${modalAnim}">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
                    <h2 style="margin:0;font-size:1.35rem;color:#1e293b;">Reminder: To-Do This Sem</h2>
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <button type="button" class="eos-btn" onclick="toggleEndOfSemHideDone()" style="border:1px solid ${endOfSemHideDone ? '#00b894' : '#cbd5e1'};border-radius:999px;padding:4px 10px;font-size:0.76rem;font-weight:700;cursor:pointer;background:${endOfSemHideDone ? '#e6fff7' : 'rgba(255,255,255,0.8)'};color:${endOfSemHideDone ? '#00876a' : '#64748b'};">Hide done</button>
                        <div style="display:inline-flex;padding:3px;border-radius:999px;background:rgba(15,23,42,0.08);gap:2px;">
                            <button type="button" class="eos-btn" onclick="setEndOfSemView('subject')" style="border:none;border-radius:999px;padding:4px 10px;font-size:0.76rem;font-weight:700;cursor:pointer;${endOfSemViewMode === 'subject' ? 'background:#fff;color:#1e293b;box-shadow:0 1px 3px rgba(0,0,0,0.12);' : 'background:transparent;color:#64748b;'}">By Subject</button>
                            <button type="button" class="eos-btn" onclick="setEndOfSemView('deadline')" style="border:none;border-radius:999px;padding:4px 10px;font-size:0.76rem;font-weight:700;cursor:pointer;${endOfSemViewMode === 'deadline' ? 'background:#fff;color:#1e293b;box-shadow:0 1px 3px rgba(0,0,0,0.12);' : 'background:transparent;color:#64748b;'}">By Deadline</button>
                        </div>
                        <button type="button" class="eos-btn" onclick="closeEndOfSemPopup()" aria-label="Close" style="width:30px;height:30px;border-radius:999px;border:1px solid #cbd5e1;background:rgba(255,255,255,0.85);color:#334155;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.95rem;">✕</button>
                    </div>
                </div>
                <div style="margin-bottom:14px;">
                    <div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:700;color:#475569;margin-bottom:5px;">
                        <span>Progress</span>
                        <span>${completed} / ${total} done (${pct}%)</span>
                    </div>
                    <div style="height:9px;border-radius:999px;background:rgba(203,213,225,0.65);overflow:hidden;">
                        <div style="height:100%;width:${pct}%;background:#00b894;border-radius:999px;transition:width 0.35s cubic-bezier(0.22,1,0.36,1);"></div>
                    </div>
                </div>
                ${bodyHtml}
            </div>
        </div>
    `;

    closeEndOfSemPopup();
    document.body.insertAdjacentHTML('beforeend', html);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('end_of_sem_welcomed_v1')) {
        sessionStorage.setItem('end_of_sem_welcomed_v1', '1');
        setTimeout(() => showEndOfSemPopup(true), 350);
    }
});
