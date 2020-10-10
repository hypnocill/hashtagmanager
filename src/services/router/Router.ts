import ViewController from "@/services/router/ViewController";

interface iRoute
{
	path: string,
	component: ViewController
}

export interface iRoutingParams
{
	urlParam: string,
	data: {[k: string]: any};
}

class Router
{
	controller: ViewController;
	controller404: ViewController;
	routes: iRoute[]	= [];
	routeParam: string	= '';

	constructor()
	{
		window.onpopstate	= this.render.bind( this );
	}

	public render( event: PopStateEvent = null )
	{
		this.reset();
		this.setController();

		if ( this.controller )
		{
			const controllerParams	= {
				urlParam	: this.routeParam,
				data		: ( event && event.state ) ? event.state : {}
			};

			this.controller.mount( controllerParams );
		}
	}

	/**
	 * @details	Passing a path that end wish a slash, will be treated as route that contains a subroute param
	 * 			e.x. '/manage/list/' -> everything that comes after the last '/' of the given path is considered a param
	 * 			and will be passed the mounted component for this route, even if it's empty
	 */
	public add( path: string, component: ViewController )
	{
		this.routes.push( { path, component } );
	}

	public setNotFound( component: ViewController )
	{
		this.controller404	= component;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////

	private setController()
	{
		const path	= window.location.pathname;

		this.routes.forEach( ( route: iRoute ) =>
			{
				if ( route.path.length > 1 && route.path.endsWith( '/' ) && path.includes( route.path ) )
				{
					this.controller	= route.component;
					this.routeParam	= path.replace( route.path, '' );
				}
				else if ( path === route.path.toLowerCase() )
				{
					this.controller	= route.component;
				}
			}
		);
	}

	private reset()
	{
		if ( this.controller )
		{
			this.controller.unmount();
		}

		if ( this.controller404 )
		{
			this.controller	= this.controller404;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////

export default new Router();