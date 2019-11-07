import React from 'react';
import DOMPurify from 'dompurify';

import Policy from './Policy';
import PrivacyPolicyEn from './PrivacyPolicy.en.md';

const PrivacyPolicy = () => (
  <Policy policy={{ __html: DOMPurify.sanitize(PrivacyPolicyEn) }} />
);

export default PrivacyPolicy;
