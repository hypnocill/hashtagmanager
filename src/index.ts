import "@/styles/index.scss";
import "@/services/firebase/firebase";

import ErrorHandler from "@/services/error_handling/ErrorHandler";
import router		from "@/services/router/Router";
import Navigation	from "@/controllers/Navigation"
import Home			from "@/controllers/Home";
import Category		from "@/controllers/Category";
import Add			from "@/controllers/Add";
import About		from "@/controllers/About";
import NotFound		from "@/controllers/NotFound";
import routes		from "@/config/routes";
import Modal		from "@/view/components/Modal/Modal";

const root	= document.getElementById( 'app' );

new ErrorHandler( new Modal( root ) );

new Navigation( root ).mount( { urlParam: '', data: {} } );

router.add( routes.HOME,		new Home( root ) );
router.add( routes.CATEGORY,	new Category( root ) );
router.add( routes.ADD,			new Add( root ) );
router.add( routes.ABOUT,		new About( root ) );

router.setNotFound( new NotFound( root ) );

router.render();


