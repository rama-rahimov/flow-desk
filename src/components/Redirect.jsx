import { Navigate, useParams } from 'react-router-dom';

export function CompanyRootRedirect() {
    const { companyLink } = useParams();

    return (
        <Navigate
            to={`/${companyLink}/dashboard`}
            replace
        />
    );
}