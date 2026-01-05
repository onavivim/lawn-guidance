import ProductWizard from '@/components/wizard/ProductWizard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <html lang="he" dir="rtl" />
        <title>STIGA - כל גינה והסטיגה שלה!</title>
        <meta name="description" content="מצא את הפתרון המושלם לגינה שלך - STIGA מתאימה לך את הפתרון האידיאלי לכל סוג גינה בכמה צעדים פשוטים" />
        <meta name="keywords" content="מכסחת דשא, STIGA, גינה, פתרון לגינה, מכסחה רובוטית, מכסחה חשמלית" />
      </Helmet>
      <ProductWizard />
    </>
  );
};

export default Index;
