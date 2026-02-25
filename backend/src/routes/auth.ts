import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /api/auth/signup/student
router.post('/signup/student', async (req: Request, res: Response) => {
    const { name, email, universityId, password } = req.body;

    if (!name || !email || !universityId || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role, university_id, is_approved)
       VALUES ($1, $2, $3, 'STUDENT', $4, TRUE)
       RETURNING id, name, email, role`,
            [name, email, password, universityId]
        );

        res.status(201).json({ message: 'Student account created.', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/auth/signup/therapist
router.post('/signup/therapist', async (req: Request, res: Response) => {
    const { name, email, specialty, password } = req.body;

    if (!name || !email || !specialty || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role, specialty, is_approved)
       VALUES ($1, $2, $3, 'THERAPIST', $4, FALSE)
       RETURNING id, name, email, role, is_approved`,
            [name, email, password, specialty]
        );

        res.status(201).json({ message: 'Therapist application submitted. Pending admin approval.', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password, requestedRole } = req.body;

    if (!email || !password || !requestedRole) {
        return res.status(400).json({ error: 'Email, password and role are required.' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const user = result.rows[0];

        // TODO: Use bcrypt to compare hashed passwords in production
        if (user.password_hash !== password) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        if (user.role.toLowerCase() !== requestedRole.toLowerCase()) {
            return res.status(401).json({ error: 'Role mismatch.' });
        }

        if (user.role === 'THERAPIST' && !user.is_approved) {
            return res.status(403).json({ error: 'Your account is pending admin approval.' });
        }

        res.status(200).json({
            message: 'Login successful.',
            token: 'jwt-token-placeholder',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                universityId: user.university_id,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;
