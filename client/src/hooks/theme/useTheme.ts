import { useComputedColorScheme } from '@mantine/core';

export const useTheme = () => {
    const colorScheme = useComputedColorScheme('light');
    const isDark = colorScheme === 'dark';

    const getColor = (lightColor: string, darkColor: string) => {
        return isDark ? darkColor : lightColor;
    };

    const colors = {
        background: getColor('#ffffff', '#1a1b1e'),
        surface: getColor('#f8f9fa', '#25262b'),
        border: getColor('#e9ecef', '#373a40'),
        text: getColor('#212529', '#c1c2c5'),
        textSecondary: getColor('#6c757d', '#909296'),
        primary: '#ff922b',
        primaryHover: getColor('#ff8c42', '#ffa94d'),
    };

    return { isDark, colors, getColor };
};