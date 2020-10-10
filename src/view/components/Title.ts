import Component from "@/services/component/Component";

export default class Title extends Component<HTMLHeadingElement>
{
	constructor( id: string | HTMLHeadingElement, title: string = '' )
	{
		super( id );
		
		if ( title )
		{
			this.element.innerText	= title;
		}
	}

	public show()
	{
		this.element.style.display	= 'block';
	}

	public hide()
	{
		this.element.style.display	= 'none';
	}

	public setTitle( title: string )
	{
		this.element.innerText	= title;
	}

	public destructor(){}
}
