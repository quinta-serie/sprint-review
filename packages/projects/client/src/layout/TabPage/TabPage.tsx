import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

interface TabPageProps { children: React.JSX.Element; }
export default function TabPage({ children }: TabPageProps) {
    return (
        <Slide in direction="right">
            <Box>
                {children}
            </Box>
        </Slide>
    );
}