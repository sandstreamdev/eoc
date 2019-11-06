import React from 'react';

import Policy from './Policy';
import TermsOfUseEn from './TermsOfUse.en.md';

const TermsOfUse = () => (
  <Policy dangerouslySetInnerHTML={{ __html: TermsOfUseEn }} />
);

export default TermsOfUse;
