import { HeaderContent } from '../molecules/HeaderContent';
import { RouteValue } from '../../../constants/routes';

interface HeaderProps {
    profileName?: string;
    backRoute?: RouteValue;
}

export const Header = ({ profileName, backRoute }: HeaderProps) => {
    return (
        <HeaderContent profileName={profileName} backRoute={backRoute} />
    );
};
