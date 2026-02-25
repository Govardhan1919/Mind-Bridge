import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/sessions/therapists - list all approved therapists
router.get('/therapists', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, name, specialty FROM users WHERE role = 'THERAPIST' AND is_approved = TRUE`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/sessions/slots?therapistId=&day= - returns booked time slots for a therapist on a day
router.get('/slots', async (req: Request, res: Response) => {
    const { therapistId, day } = req.query;
    if (!therapistId || !day) {
        return res.status(400).json({ error: 'therapistId and day are required.' });
    }
    try {
        const result = await pool.query(
            `SELECT time_slot FROM sessions 
             WHERE therapist_id = $1 AND time_slot LIKE $2 AND status != 'CANCELLED'`,
            [therapistId, `${day}%`]
        );
        const bookedSlots = result.rows.map((r: { time_slot: string }) => {
            const parts = r.time_slot.split(' ');
            return parts.slice(1).join(' ');
        });
        res.status(200).json({ bookedSlots });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/sessions/my?studentId= - get all sessions for a student
router.get('/my', async (req: Request, res: Response) => {
    const { studentId } = req.query;
    if (!studentId) {
        return res.status(400).json({ error: 'studentId is required.' });
    }
    try {
        const result = await pool.query(
            `SELECT s.*, u.name AS therapist_name
             FROM sessions s
             LEFT JOIN users u ON u.id::text = s.therapist_id
             WHERE s.student_id = $1
             ORDER BY s.created_at DESC`,
            [studentId]
        );
        res.status(200).json({ sessions: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/sessions/book - create a new booking
router.post('/book', async (req: Request, res: Response) => {
    const { studentId, therapistId, type, timeSlot } = req.body;

    if (!studentId || !therapistId || !type || !timeSlot) {
        return res.status(400).json({ error: 'All booking fields are required.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO sessions (student_id, therapist_id, type, time_slot, status)
       VALUES ($1, $2, $3, $4, 'PENDING')
       RETURNING id, student_id, therapist_id, type, time_slot, status`,
            [studentId, therapistId, type.toUpperCase(), timeSlot]
        );

        res.status(201).json({ message: 'Session booked successfully!', session: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/sessions/therapist?therapistId= - sessions assigned to a therapist
router.get('/therapist', async (req: Request, res: Response) => {
    const { therapistId } = req.query;
    if (!therapistId) {
        return res.status(400).json({ error: 'therapistId is required.' });
    }
    try {
        const result = await pool.query(
            `SELECT s.*, u.name AS student_name, u.email AS student_email
             FROM sessions s
             LEFT JOIN users u ON u.id::text = s.student_id
             WHERE s.therapist_id = $1
             ORDER BY s.created_at DESC`,
            [therapistId]
        );
        res.json({ sessions: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// PATCH /api/sessions/:id/meeting-link - therapist sets/updates Teams meeting link
router.patch('/:id/meeting-link', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { meetingLink } = req.body;
    if (!meetingLink) {
        return res.status(400).json({ error: 'meetingLink is required.' });
    }
    try {
        await pool.query(
            `UPDATE sessions SET meeting_link = $1, status = 'CONFIRMED' WHERE id = $2`,
            [meetingLink, id]
        );
        res.json({ message: 'Meeting link updated. Session confirmed.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;

