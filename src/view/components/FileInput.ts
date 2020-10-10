import Component from "@/services/component/Component";

export default class FileInput extends Component<HTMLInputElement>
{
	onFileImport: ( contents: Event ) => void;

	constructor(
		id: string | HTMLInputElement,
		onFileImport: ( event: Event ) => void = ( event: Event ) => {}
	) {
		super( id );
		this.element.type	= 'file';
		this.onFileImport	= ( event: Event ) => onFileImport( event );

		this.element.addEventListener( 'change', this.onFileImport );
	}

	public destructor()
	{
		this.element.removeEventListener( 'change', this.onFileImport );
	}
}
