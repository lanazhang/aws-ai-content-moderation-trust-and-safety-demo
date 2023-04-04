import React from 'react';
import chats from "../resources/chat_simulation.json";


class Simulator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            simuFlag: false
        }
    }

    handleSimulation = () => {
        this.setState({simuFlag: !this.state.simuFlag});
    }

    componentDidMount() {
        // Sample camera
        let counter = 0;
        setInterval(() => {
            if (this.state.simuFlag) {
                setTimeout(() => {
                    if (counter >= chats.length)
                    counter = 0;
                    this.props.onSimulation(chats[counter]);
                    counter ++;
                }, Math.floor(Math.random() * 5000));
                //console.log(s);
            }
        }, 1000);
    }

    render() {
        return (
            <div className="simu">
                <div onClick={this.handleSimulation} className={!this.state.simuFlag?"playsimu":"pausesimu"} >
                    {this.state.simuFlag?"Pasuse Simulation":"Start Simulation"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
        );
    }
}

export default Simulator;