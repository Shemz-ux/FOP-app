import LegalPage from './components/LegalPage';
import { terms_of_use } from './legal.copy.jsx';

export default function TermsOfUse() {
  return <LegalPage copy={terms_of_use} />;
}
