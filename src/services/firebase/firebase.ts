import 'firebase/analytics';
import firebase from 'firebase/app';

import config	from '@/services/firebase/config';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
firebase.initializeApp( config );

export const Analytics	= firebase.analytics();

export default firebase;
