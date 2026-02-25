import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/admin/stats - platform statistics
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const [therapists, students, sessions, pending] = await Promise.all([
            pool.query(`SELECT COUNT(*) FROM users WHERE role = 'THERAPIST' AND is_approved = TRUE`),
            pool.query(`SELECT COUNT(*) FROM users WHERE role = 'STUDENT'`),
            pool.query(`SELECT COUNT(*) FROM sessions`),
            pool.query(`SELECT COUNT(*) FROM users WHERE role = 'THERAPIST' AND is_approved = FALSE`),
        ]);
        res.json({
            therapists: parseInt(therapists.rows[0].count),
            students: parseInt(students.rows[0].count),
            sessions: parseInt(sessions.rows[0].count),
            pendingApprovals: parseInt(pending.rows[0].count),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/admin/therapists - all therapists (approved + pending)
router.get('/therapists', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, specialty, is_approved, created_at FROM users WHERE role = 'THERAPIST' ORDER BY created_at DESC`
        );
        res.json({ therapists: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/admin/therapists - add a therapist directly (admin-created, auto-approved)
router.post('/therapists', async (req: Request, res: Response) => {
    const { name, email, specialty, password } = req.body;
    if (!name || !email || !specialty || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role, specialty, is_approved)
             VALUES ($1, $2, $3, 'THERAPIST', $4, TRUE)
             RETURNING id, name, email, specialty, is_approved, created_at`,
            [name, email, password, specialty]
        );
        res.status(201).json({ message: 'Therapist created.', therapist: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// PATCH /api/admin/therapists/:id/approve - approve a pending therapist
router.patch('/therapists/:id/approve', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query(`UPDATE users SET is_approved = TRUE WHERE id = $1`, [id]);
        res.json({ message: 'Therapist approved.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// DELETE /api/admin/therapists/:id - remove a therapist
router.delete('/therapists/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query(`DELETE FROM users WHERE id = $1 AND role = 'THERAPIST'`, [id]);
        res.json({ message: 'Therapist removed.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/admin/activity - all sessions with student info
router.get('/activity', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT s.id, s.student_id, s.therapist_id, s.type, s.time_slot, s.status, s.created_at,
                    u.name AS student_name, u.email AS student_email
             FROM sessions s
             LEFT JOIN users u ON u.id::text = s.student_id
             ORDER BY s.created_at DESC
             LIMIT 50`
        );
        res.json({ activity: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/admin/students - list all students
router.get('/students', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, university_id, created_at FROM users WHERE role = 'STUDENT' ORDER BY created_at DESC`
        );
        res.json({ students: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;
