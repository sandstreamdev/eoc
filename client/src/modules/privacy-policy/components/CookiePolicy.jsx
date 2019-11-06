import React from 'react';

import Policy from './Policy';
import CookiePolicyEn from './CookiePolicy.en.md';

const CookiePolicy = () => (
  <Policy dangerouslySetInnerHTML={{ __html: CookiePolicyEn }} />
);

export default CookiePolicy;
