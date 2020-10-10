import Component from "@/services/component/Component";

export default class StarredCheckbox extends Component<HTMLInputElement>
{
	public getIsSelected(): boolean
	{
		return this.element.checked;
	}

	public check()
	{
		this.element.checked	= true;
	}

	public uncheck()
	{
		this.element.checked	= false;
	}

	public toggle()
	{
		this.element.checked	= ! this.element.checked;
	}

	public destructor(){}
}
