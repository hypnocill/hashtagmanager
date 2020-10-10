export default abstract class Component<T extends HTMLElement>
{
	protected id: string;
	protected element: T;

	constructor( id: string | T )
	{
		if ( typeof id === 'string' )
		{
			this.id			= id;
			this.element	= document.getElementById( id ) as T;
		}
		else
		{
			this.element	= id;
		}

	}

	public getId(): string | null
	{
		return this.id;
	}

	public getElement(): T
	{
		return this.element;
	}

	public abstract destructor(): void;
}