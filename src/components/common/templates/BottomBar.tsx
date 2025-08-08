import React from 'react';
import { BottomBarContent } from '../organisms/BottomBarContent';

export const BottomBar = () => {
    return (
        <nav className="bg-white border-t border-gray-200 px-4 py-2">
            <BottomBarContent />
        </nav>
    );
};
