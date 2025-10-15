import React from 'react';

const logoUrl = 'https://hamquiz.it/HamQuizlogo.png';

export const HamQuizLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src={logoUrl}
        alt="Hamquiz Logo"
        className={className}
    />
);
