export default class AppStorage
{
	getAll(): {[k: string]: any}
	{
		return localStorage as object;
	}

	get( key: string ): string
	{
		return localStorage.getItem( key );
	}

	set( key: string, value: any ): void
	{
		localStorage.setItem( key, JSON.stringify( value ) );
	}

	delete( key: string )
	{
		localStorage.removeItem( key );
	}
}