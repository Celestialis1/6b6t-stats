const sanitizeUsername = (username) => {
    if (!username || typeof username !== 'string') return null;

    const sanitized = username.trim().replace(/[^a-zA-Z0-9_-]/g, '');

    if (sanitized.length < 3 || sanitized.length > 16) {
        return null;
    }

    return sanitized;
};

module.exports = sanitizeUsername;
