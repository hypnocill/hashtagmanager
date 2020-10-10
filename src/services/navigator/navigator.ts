export default class Navigator
{
	public static getCurrentPath(): string
	{
		return window.location.pathname;
	}

	public static go( path: string, data: any = '')
	{
		window.history.pushState( data, '', path );
		dispatchEvent( new PopStateEvent( 'popstate', { state: data } ) );
	}
}