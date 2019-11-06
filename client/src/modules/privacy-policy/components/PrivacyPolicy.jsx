import React from 'react';

import Policy from './Policy';
import PrivacyPolicyEn from './PrivacyPolicy.en.md';

const PrivacyPolicy = () => (
  <Policy dangerouslySetInnerHTML={{ __html: PrivacyPolicyEn }} />
);

export default PrivacyPolicy;
