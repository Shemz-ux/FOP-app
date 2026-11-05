import LegalPage from './components/LegalPage';
import { privacy_policy } from './legal.copy.jsx';

export default function PrivacyPolicy() {
  return <LegalPage copy={privacy_policy} />;
}
