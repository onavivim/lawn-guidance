import ProductWizard from '@/components/wizard/ProductWizard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <html lang="he" dir="rtl" />
        <title>STIGA - מצא את המכסחת המושלמת עבורך</title>
        <meta name="description" content="אשף המלצות מוצרים של STIGA - מצא את מכסחת הדשא המושלמת לגינה שלך בכמה צעדים פשוטים" />
        <meta name="keywords" content="מכסחת דשא, STIGA, גינה, מכסחה רובוטית, מכסחה חשמלית" />
      </Helmet>
      <ProductWizard />
    </>
  );
};

export default Index;
