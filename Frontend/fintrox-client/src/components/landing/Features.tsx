import React from 'react';
import FeatureCard from './FeatureCard';

const Features: React.FC = () => {
  return (
    <>
      <FeatureCard
        icon="account_tree"
        title="Smart Loan Management"
        description="Automate origination, underwriting, and servicing workflows. Our intelligent engine routes applications based on your exact risk parameters, significantly reducing manual review time while maintaining strict compliance."
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCmg2QV1Tzk9n5v96y9T5AptS2uojtZIZ_ZZad0C1wT7DfYWUYgYVkMYSpZv6tSLi5GTp5nG9IYRxQ5JIJ6pawP8-Sgc1KvPCYFrhNGEG9Tuq9Sm1Sb5XH2B0_zOYFTGFes-0EHenn94YAO2UB0smiuWNgfo_6ihPw5DMzXYl2SEOD2YpAHiOf74YXcWqjutqbfxpQ2tvAqHqNq37LxR_pP2l2OGDcRpjKpfwyL_vpdVa6u1cosc9CY"
        features={[
          "Customizable underwriting rules engine",
          "Automated document verification",
          "Dynamic repayment scheduling",
        ]}
      />

      <FeatureCard
        icon="track_changes"
        title="Real-time Collection Tracking"
        description="Gain absolute visibility into your cash flow. Reconcile payments instantly across multiple gateways and automate follow-ups for delinquent accounts, ensuring a healthier bottom line."
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuABGz2zJRMilcRkft3TfV8SLme0R3cLINn11X01TzTzK5-QGgDCeNoMKd1YUpb6BAaYppAxFrGLXnQYEJ8SQ9OXsE9sCGXFn0o1PVWk8zjEsLAIvD86jH2fokE8I3OdxKYj4SenNxpK41S3dq_KUSDAkCnir6Qw93RYsnNG75-ZZo4E79a7zOLU4EKtIeSL9VLFx06QhdleLy0alO1W2IYCtvHEyxa39o1UlxKSdLSKUeWvzEbcIFE5"
        reverse={true}
      />

      <FeatureCard
        icon="bar_chart"
        title="Team Performance Analytics"
        description="Empower management with granular oversight. Track agent productivity, evaluate collection success rates, and identify bottlenecks in your operational pipeline through intuitive, interactive reports."
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuChyemH4tet--467ob8xO43MteHxtT1HATa6EG-ZUQGDZI8EdSrpe9C7A10eOFAv9K_FBv7XlNilDYq01ISw2sNIKulSoq7yCMDObt1oBzUmsoCkp--WTl5OOOQk1GV_8f9X2Ac_a0rlMcQmrOI9fr9KhPlVPSs1Ufsk01FOI71zk8azSFIBA2XdccNUGG-t_21gYniR7qKFZXiZUC5_zInvy3pLyC3yj68Wp3gc5yD8HRppMlhxRUu"
        features={[
          "Agent-level KPI tracking",
          "Custom report generation",
        ]}
      />
    </>
  );
};

export default Features;