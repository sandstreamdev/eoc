import React from 'react';
import DOMPurify from 'dompurify';

import Policy from './Policy';
import TermsOfUseEn from './TermsOfUse.en.md';

const TermsOfUse = () => (
  <Policy policy={{ __html: DOMPurify.sanitize(TermsOfUseEn) }} />
);

export default TermsOfUse;
