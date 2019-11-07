import React from 'react';
import DOMPurify from 'dompurify';

import Policy from './Policy';
import CookiePolicyEn from './CookiePolicy.en.md';

const CookiePolicy = () => (
  <Policy policy={{ __html: DOMPurify.sanitize(CookiePolicyEn) }} />
);

export default CookiePolicy;
