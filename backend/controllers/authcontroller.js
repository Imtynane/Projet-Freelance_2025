const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
             return res.status(409).json({ error: "Email déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({message: 'Utilisateur enregistré avec succès', userId: user.id});
    } catch (error) {
        res.status(500).json({error: 'Erreur lors de l\'enregistrement de l\'utilisateur'});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return res.status(401).json({error: 'Email ou mot de passe incorrect'});
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({error: 'Email ou mot de passe incorrect'});
        }

        const token = jwt.sign(
            {userId: user.id, name: user.name, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({error: 'Erreur lors de la connexion de l\'utilisateur'});
    }
};