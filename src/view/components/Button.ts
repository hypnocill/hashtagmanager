import Component from "@/services/component/Component";

export default class Button extends Component<HTMLElement>
{
	onClick: () => void;

	constructor(
		id: string | HTMLElement,
		onClick: () => void = () => {}
	) {
		super( id );
		this.onClick	= onClick;

		this.element.addEventListener( 'click', this.onClick );
	}

	public destructor()
	{
		this.element.removeEventListener( 'click', this.onClick );
	}
}
