interface errorElement {
	show: ( content: string ) => void
}

export default class ErrorHandler
{
	element: errorElement;

	constructor( element: errorElement )
	{
		this.element	= element;
		this.setGeneralErrorHandling();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private	setGeneralErrorHandling()
	{
		window.onerror	= ( errorMsg: string, url: string, lineNumber: number ) =>
		{
			let message	= errorMsg;

			if ( errorMsg.indexOf( 'Script error.' ) > -1 )
			{
				message	= '<h1>Unknown error has occured!</h1>'
				+ '<p>If you continue to experience difficulties using the application - '
				+ 'please, delete your browser cache and/or try a different browser</p>';
			}
			else
			{
				message	= message.substring( message.indexOf( ':' ) + 1 );
			}

			message += '<hr/><small>If you keep seeing this message, contact me at ivodevmail@gmail.com</small>'
	
			this.element.show( message );
		}
	}
}