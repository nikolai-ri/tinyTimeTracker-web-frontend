import React, { Component } from 'react';
import { withAuthentication } from '../Session';
import { LineChart } from 'react-chartkick'
import 'chart.js'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            workdays: [],
            workdaysLineChart: {},
            workdaysShouldHaveWorked: {},
            workedOverhoursPerDay: {}
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                this.props.firebase.workdays(user.uid).on('value', snapshot => {

                    const workdaysObject = snapshot.val();
                    const workdaysLineChart = this.calculateWorkHours(workdaysObject);
                    const workdaysShouldHaveWorked = this.calculatedShouldHaveWorked(workdaysObject);
                    const overTime = this.calculateOverHours(workdaysLineChart, workdaysShouldHaveWorked).toPrecision(4);
                    const workedOverhoursPerDay = this.calculateOverHoursPerDay(workdaysLineChart, workdaysShouldHaveWorked);

                    const workdaysList = Object.keys(workdaysObject).map(workdayId => ({
                        ...workdaysObject[workdayId],
                        uid: workdayId,
                    }));
                    this.setState({
                        workdays: workdaysList,
                        loading: false,
                        workdaysLineChart: workdaysLineChart,
                        workdaysShouldHaveWorked: workdaysShouldHaveWorked,
                        overTime: overTime,
                        workedOverhoursPerDay: workedOverhoursPerDay,
                    });
                });
            }
        })

    }

    componentWillUnmount() {
        this.props.firebase.workdays(this.authUser).off();
    }

    calculateWorkHours(workdays) {

        let workdaysLineChartObject = {};

        Object.keys(workdays).forEach((element) => {
            let workdayDate = new Date(workdays[element].id + (24 * 3600 * 1000));
            let workdayLength = 0;

            workdays[element].workIntervals.forEach((element) => {
                workdayLength += (element[1] - element[0]);
            });

            let workdayLengthDate = new Date(workdayLength); // is now worked hours in time distance from epoch time
            let workdayCalculatedLength = workdayLengthDate.getHours() - 1 + workdayLengthDate.getMinutes() / 60;


            workdaysLineChartObject[workdayDate.toISOString().substring(0, 10)] = workdayCalculatedLength;
        })
        return workdaysLineChartObject;
    }

    calculatedShouldHaveWorked(workdays) {
        let shouldHaveWorkedWorkdaysLineChartObject = {};
        let switchDateObject = new Date('2019-09-01');
        Object.keys(workdays).forEach((element) => {
            let workdayDate = new Date(workdays[element].id + (24 * 3600 * 1000));
            if (workdayDate < switchDateObject) {
                shouldHaveWorkedWorkdaysLineChartObject[workdayDate.toISOString().substring(0, 10)] = 7;
            } else if (workdayDate >= switchDateObject) {
                shouldHaveWorkedWorkdaysLineChartObject[workdayDate.toISOString().substring(0, 10)] = 7.75;
            }
        });
        return shouldHaveWorkedWorkdaysLineChartObject;
    }

    calculateOverHours(actualWorkedHours, shouldHaveWorkedHours) {
        let overTime = 0;
        Object.keys(actualWorkedHours).forEach((element) => {
            overTime += actualWorkedHours[element] - shouldHaveWorkedHours[element];
        });
        return overTime;
    }

    calculateOverHoursPerDay(actualWorkedHours, shouldHaveWorkedHours) {
        let workedOverhoursPerDay = {};
        Object.keys(actualWorkedHours).forEach((element) => {
            workedOverhoursPerDay[element] = actualWorkedHours[element] - shouldHaveWorkedHours[element];
        });
        return workedOverhoursPerDay
    };


    render() {
        const { workdays, loading } = this.state;
        return (
            <div>
                <h1>Workdays</h1>
                {loading && <div>Loading ...</div>}
                <p>Total worked overtime: {this.state.overTime}</p>
                <LineChart data={[
                    { "name": "Worked hours", "data": this.state.workdaysLineChart },
                    { "name": "Should have worked", "data": this.state.workdaysShouldHaveWorked },
                ]} />
                <LineChart data={[{ "name": "Overhours", "data": this.state.workedOverhoursPerDay }]} />
            </div>
        );
    }
}

export default HomePage = withAuthentication(HomePage);
