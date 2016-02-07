class LoaderElement extends React.Component {

    render() {
        return (
            <div style={{position: 'absolute',
                                height: '100%',
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.80)',
                                zIndex: '1'}}>
                <div className="sk-folding-cube" style={{marginTop: '15%'}}>
                    <div className="sk-cube1 sk-cube"></div>
                    <div className="sk-cube2 sk-cube"></div>
                    <div className="sk-cube4 sk-cube"></div>
                    <div className="sk-cube3 sk-cube"></div>
                </div>
            </div>
        )
    }

}

export class LoadingAnimation {

    static start(element) {
        let hostElement = $("<div style='position: relative; width: 100%; height: 100%'></div>")[0];
        $(element).prepend(hostElement);
        ReactDOM.render(<LoaderElement />,hostElement);

        return {
            stop: () => {
                ReactDOM.unmountComponentAtNode(hostElement);
                hostElement.remove();
            }
        }
    }


}