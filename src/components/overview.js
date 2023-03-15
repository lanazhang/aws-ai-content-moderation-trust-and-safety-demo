import React from 'react';
import {
  Box,
  Button,
  ColumnLayout,
  Container,
  Header,
  SpaceBetween,
  Flashbar
} from '@cloudscape-design/components';
import { CounterLink } from './commons/common-components';
import BarChart from "@cloudscape-design/components/bar-chart";
import PieChart from "@cloudscape-design/components/pie-chart";
import LineChart from "@cloudscape-design/components/line-chart";


export default () => {
  const [notifications, setNotifications] = React.useState([{
    type: "info",
    dismissible: true,
    dismissLabel: "Dismiss message",
    onDismiss: () => setNotifications([]),
    content: (
      <>
        This report demonstrates the concept of a top-down dashboard that presents key business insights. The data used in this report is static and serves as an example of how such a dashboard could look and function.
      </>
    ),
    id: "message_1"
  }]);

   const report =
    {
      "summary": {
        "total_user": 30484,
        "toxic_user": 2501,
        "total_post": 98501,
        "avg_rate": 0.1734,
      },
      "top_text_categories":
      [
        {
          "title":"PROFANITY",
          "value":123,
        },
        {
          "title":"HATE_SPEECH",
          "value":76,
        },
        {
          "title":"SEXUAL",
          "value":20,
        },
        {
          "title":"INSULT",
          "value":18,
        },
        {
          "title":"VIOLENCE_OR_THREAT",
          "value":9,
        },
        {
          "title":"GRAPHIC",
          "value":3,
        },
        {
          "title":"HARASSMENT_OR_ABUSE",
          "value":2
        },
      ],
      "top_image_categories":
      [
        {
          "title":"Suggestive",
          "value":223,
        },
        {
          "title":"Nudity",
          "value":176,
        },
        {
          "title":"Tobacco",
          "value":120,
        },
        {
          "title":"Alcohol",
          "value":118,
        },
        {
          "title":"Hate symbol",
          "value":19,
        }
      ],
      "top_gamers": [
        {x:"supergamer001", y:123},
        {x:"shit-head", y:91},
        {x:"N0tail", y:84},
        {x:"JerAx", y:76},
        {x:"Ceb", y:67},
        {x:"MinD_ContRol", y:53},
        {x:"Mira01", y:52},
        {x:"Zai", y:41},
        {x:"SumaiL", y:39},
        {x:"Somnus", y:21},
      ]
    };

   const Summary = () => (
    <ColumnLayout columns={4} variant="text-grid">
      <SpaceBetween size="l">
          <Box variant="awsui-key-label">Total numbers of users</Box>
          <CounterLink>{report.summary.total_user.toLocaleString('en-US')}</CounterLink>
      </SpaceBetween>
      <SpaceBetween size="l">
          <Box variant="awsui-key-label">Toxic users</Box>
          <CounterLink>{report.summary.toxic_user.toLocaleString('en-US')}</CounterLink>
      </SpaceBetween>
      <SpaceBetween size="l">
          <Box variant="awsui-key-label">Total posts</Box>
          <CounterLink>{report.summary.total_post.toLocaleString('en-US')}</CounterLink>
      </SpaceBetween>
      <SpaceBetween size="l">
          <Box variant="awsui-key-label">Toxic rate</Box>
          <CounterLink>{Number(report.summary.avg_rate).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})}</CounterLink>
      </SpaceBetween>
    </ColumnLayout>
  );

  const TopTextCategories = () => (
    <ColumnLayout columns={1} variant="text-grid">
      <SpaceBetween size="l">
        <PieChart
        hideFilter={false}
        data={report.top_text_categories}
        detailPopoverContent={(datum, sum) => [
          { key: "Resource count", value: datum.value },
          {
            key: "Percentage",
            value: `${((datum.value / sum) * 100).toFixed(
              0
            )}%`
          },
          { key: "Last update on", value: datum.lastUpdate }
        ]}
        segmentDescription={(datum, sum) =>
          `${datum.value} posts, ${(
            (datum.value / sum) *
            100
          ).toFixed(0)}%`
        }
        i18nStrings={{
          detailsValue: "Value",
          detailsPercentage: "Percentage",
          filterLabel: "Filter text/audio category",
          filterPlaceholder: "Filter data",
          filterSelectedAriaLabel: "selected",
          detailPopoverDismissAriaLabel: "Dismiss",
          legendAriaLabel: "Legend",
          chartAriaRoleDescription: "pie chart",
          segmentAriaRoleDescription: "segment"
        }}
        ariaDescription="Pie chart showing how many audio are currently in which toxicity category."
        ariaLabel="Pie chart"
        errorText="Error loading data."
        loadingText="Loading chart"
        recoveryText="Retry"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box variant="p" color="inherit">
              There is no data available
            </Box>
          </Box>
        }
        noMatch={
          <Box textAlign="center" color="inherit">
            <b>No matching data</b>
            <Box variant="p" color="inherit">
              There is no matching data to display
            </Box>
            <Button>Clear filter</Button>
          </Box>
        }
      />        
      </SpaceBetween>
    </ColumnLayout>
  );

  const TopImageCategories = () => (
    <ColumnLayout columns={1} variant="text-grid">
      <SpaceBetween size="l">
        <PieChart
        hideFilter={false}
        data={report.top_image_categories}
        detailPopoverContent={(datum, sum) => [
          { key: "Resource count", value: datum.value },
          {
            key: "Percentage",
            value: `${((datum.value / sum) * 100).toFixed(
              0
            )}%`
          },
          { key: "Last update on", value: datum.lastUpdate }
        ]}
        segmentDescription={(datum, sum) =>
          `${datum.value} posts, ${(
            (datum.value / sum) *
            100
          ).toFixed(0)}%`
        }
        i18nStrings={{
          detailsValue: "Value",
          detailsPercentage: "Percentage",
          filterLabel: "Filter image/video category",
          filterPlaceholder: "Filter data",
          filterSelectedAriaLabel: "selected",
          detailPopoverDismissAriaLabel: "Dismiss",
          legendAriaLabel: "Legend",
          chartAriaRoleDescription: "pie chart",
          segmentAriaRoleDescription: "segment"
        }}
        ariaDescription="Pie chart showing how many audio are currently in which toxicity category."
        ariaLabel="Pie chart"
        errorText="Error loading data."
        loadingText="Loading chart"
        recoveryText="Retry"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box variant="p" color="inherit">
              There is no data available
            </Box>
          </Box>
        }
        noMatch={
          <Box textAlign="center" color="inherit">
            <b>No matching data</b>
            <Box variant="p" color="inherit">
              There is no matching data to display
            </Box>
            <Button>Clear filter</Button>
          </Box>
        }
      />        
      </SpaceBetween>
    </ColumnLayout>
  );

  const ToxicityOvertime = () => {
    return <LineChart
      series={[
        {
          title: "Suggestive",
          type: "line",
          data: [
            { x: new Date("2023-03-01"), y: 110 },
            { x: new Date("2023-03-02"), y: 153 },
            { x: new Date("2023-03-03"), y: 182 },
            { x: new Date("2023-03-04"), y: 113 },
            { x: new Date("2023-03-05"), y: 124 },
            { x: new Date("2023-03-06"), y: 152 },
            { x: new Date("2023-03-07"), y: 198 },
            { x: new Date("2023-03-08"), y: 158 },
            { x: new Date("2023-03-09"), y: 103 },
            { x: new Date("2023-03-10"), y: 126 },
            { x: new Date("2023-03-11"), y: 110 },
            { x: new Date("2023-03-12"), y: 146 },
            { x: new Date("2023-03-13"), y: 183 },
            { x: new Date("2023-03-14"), y: 120 },
            { x: new Date("2023-03-15"), y: 168 },
            { x: new Date("2023-03-16"), y: 192 },
            { x: new Date("2023-03-17"), y: 245 },
            { x: new Date("2023-03-18"), y: 287 },
            { x: new Date("2023-03-19"), y: 220 },
            { x: new Date("2023-03-20"), y: 348 },
            { x: new Date("2023-03-21"), y: 292 },
            { x: new Date("2023-03-22"), y: 338 },
            { x: new Date("2023-03-23"), y: 362 },
            { x: new Date("2023-03-24"), y: 345 },
            { x: new Date("2023-03-25"), y: 342 },
            { x: new Date("2023-03-26"), y: 394 },
            { x: new Date("2023-03-27"), y: 447 },
            { x: new Date("2023-03-28"), y: 474 },
            { x: new Date("2023-03-29"), y: 463 },
            { x: new Date("2023-03-30"), y: 449 },
            { x: new Date("2023-03-31"), y: 452 }
          ],
          valueFormatter: function o(e) {
            return e.toFixed(2);
          }
        },
        {
          title: "Nudity",
          type: "line",
          data: [
            { x: new Date("2023-03-01"), y: 13 },
            { x: new Date("2023-03-02"), y: 18 },
            { x: new Date("2023-03-03"), y: 26 },
            { x: new Date("2023-03-04"), y: 20 },
            { x: new Date("2023-03-05"), y: 21 },
            { x: new Date("2023-03-06"), y: 26 },
            { x: new Date("2023-03-07"), y: 32 },
            { x: new Date("2023-03-08"), y: 38 },
            { x: new Date("2023-03-09"), y: 35 },
            { x: new Date("2023-03-10"), y: 39 },
            { x: new Date("2023-03-11"), y: 37 },
            { x: new Date("2023-03-12"), y: 45 },
            { x: new Date("2023-03-13"), y: 47 },
            { x: new Date("2023-03-14"), y: 48 },
            { x: new Date("2023-03-15"), y: 42 },
            { x: new Date("2023-03-16"), y: 50 },
            { x: new Date("2023-03-17"), y: 51 },
            { x: new Date("2023-03-18"), y: 52 },
            { x: new Date("2023-03-19"), y: 52 },
            { x: new Date("2023-03-20"), y: 54 },
            { x: new Date("2023-03-21"), y: 59 },
            { x: new Date("2023-03-22"), y: 58 },
            { x: new Date("2023-03-23"), y: 60 },
            { x: new Date("2023-03-24"), y: 64 },
            { x: new Date("2023-03-25"), y: 68 },
            { x: new Date("2023-03-26"), y: 62 },
            { x: new Date("2023-03-27"), y: 64 },
            { x: new Date("2023-03-28"), y: 65 },
            { x: new Date("2023-03-29"), y: 56 },
            { x: new Date("2023-03-40"), y: 50 },
            { x: new Date("2023-03-31"), y: 59 }
          ],
          valueFormatter: function o(e) {
            return e.toFixed(2);
          }
        },
        {
          title: "Hate speech",
          type: "line",
          data: [
            { x: new Date("2023-03-01"), y: 113 },
            { x: new Date("2023-03-02"), y: 118 },
            { x: new Date("2023-03-03"), y: 126 },
            { x: new Date("2023-03-04"), y: 120 },
            { x: new Date("2023-03-05"), y: 121 },
            { x: new Date("2023-03-06"), y: 126 },
            { x: new Date("2023-03-07"), y: 132 },
            { x: new Date("2023-03-08"), y: 138 },
            { x: new Date("2023-03-09"), y: 235 },
            { x: new Date("2023-03-10"), y: 119 },
            { x: new Date("2023-03-11"), y: 137 },
            { x: new Date("2023-03-12"), y: 145 },
            { x: new Date("2023-03-13"), y: 147 },
            { x: new Date("2023-03-14"), y: 248 },
            { x: new Date("2023-03-15"), y: 142 },
            { x: new Date("2023-03-16"), y: 150 },
            { x: new Date("2023-03-17"), y: 151 },
            { x: new Date("2023-03-18"), y: 152 },
            { x: new Date("2023-03-19"), y: 252 },
            { x: new Date("2023-03-20"), y: 254 },
            { x: new Date("2023-03-21"), y: 259 },
            { x: new Date("2023-03-22"), y: 158 },
            { x: new Date("2023-03-23"), y: 160 },
            { x: new Date("2023-03-24"), y: 164 },
            { x: new Date("2023-03-25"), y: 368 },
            { x: new Date("2023-03-26"), y: 362 },
            { x: new Date("2023-03-27"), y: 264 },
            { x: new Date("2023-03-28"), y: 265 },
            { x: new Date("2023-03-29"), y: 156 },
            { x: new Date("2023-03-30"), y: 150 },
            { x: new Date("2023-03-31"), y: 159 }
          ],
          valueFormatter: function o(e) {
            return e.toFixed(2);
          }
        },
        {
          title: "Profanity",
          type: "line",
          data: [
            { x: new Date("2023-03-01"), y: 413 },
            { x: new Date("2023-03-02"), y: 418 },
            { x: new Date("2023-03-03"), y: 426 },
            { x: new Date("2023-03-04"), y: 420 },
            { x: new Date("2023-03-05"), y: 521 },
            { x: new Date("2023-03-06"), y: 526 },
            { x: new Date("2023-03-07"), y: 532 },
            { x: new Date("2023-03-08"), y: 538 },
            { x: new Date("2023-03-09"), y: 635 },
            { x: new Date("2023-03-10"), y: 519 },
            { x: new Date("2023-03-11"), y: 637 },
            { x: new Date("2023-03-12"), y: 645 },
            { x: new Date("2023-03-13"), y: 647 },
            { x: new Date("2023-03-14"), y: 648 },
            { x: new Date("2023-03-15"), y: 612 },
            { x: new Date("2023-03-16"), y: 750 },
            { x: new Date("2023-03-17"), y: 751 },
            { x: new Date("2023-03-18"), y: 752 },
            { x: new Date("2023-03-19"), y: 752 },
            { x: new Date("2023-03-20"), y: 854 },
            { x: new Date("2023-03-21"), y: 859 },
            { x: new Date("2023-03-22"), y: 858 },
            { x: new Date("2023-03-23"), y: 960 },
            { x: new Date("2023-03-24"), y: 964 },
            { x: new Date("2023-03-25"), y: 968 },
            { x: new Date("2023-03-26"), y: 962 },
            { x: new Date("2023-03-27"), y: 964 },
            { x: new Date("2023-03-28"), y: 865 },
            { x: new Date("2023-03-29"), y: 856 },
            { x: new Date("2023-03-30"), y: 950 },
            { x: new Date("2023-03-31"), y: 959 }
          ],
          valueFormatter: function o(e) {
            return e.toFixed(2);
          }
        }
      ]}
      xDomain={[
        new Date("2023-03-01"),
        new Date("2023-03-31")
      ]}
      yDomain={[0, 1000]}
      i18nStrings={{
        filterLabel: "Filter displayed data",
        filterPlaceholder: "Filter data",
        filterSelectedAriaLabel: "selected",
        detailPopoverDismissAriaLabel: "Dismiss",
        legendAriaLabel: "Legend",
        chartAriaRoleDescription: "line chart",
        xTickFormatter: e =>
          e
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            })
            .split(",")
            .join("\n"),
        yTickFormatter: function o(e) {
          return e.toFixed(0);
        }
      }}
      ariaLabel="Numbers of posts over time"
      errorText="Error loading data."
      height={200}
      loadingText="Loading chart"
      recoveryText="Retry"
      xScaleType="time"
      yTitle="Numbers of audios"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data to display
          </Box>
          <Button>Clear filter</Button>
        </Box>
      }
    />
  }

  const TopGamers = () => (
    <ColumnLayout columns={1} variant="text-grid">
      <SpaceBetween size="l">
        <BarChart
          hideFilter={true}
          hideLegend={true}
          height={300}
          series={[
            {
              title: "Numbers of toxic audios",
              type: "bar",
              data: report.top_gamers,
              valueFormatter: e => e
            }
          ]}
          xDomain={["supergamer001", "shit-head","N0tail","JerAx","Ceb","MinD_ContRol","Mira01","Zai","SumaiL","Somnus"]}
          yDomain={[0, 150]}
          i18nStrings={{
            detailPopoverDismissAriaLabel: "Dismiss",
            legendAriaLabel: "Legend",
            chartAriaRoleDescription: "line chart",
            yTickFormatter: function o(e) {
              return e;
            }
          }}
          ariaLabel="Single data series line chart"
          errorText="Error loading data."
          loadingText="Loading chart"
          recoveryText="Retry"
          xScaleType="categorical"
          xTitle="Toxicity category"
          yTitle="Numbers of audios"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No data available</b>
              <Box variant="p" color="inherit">
                There is no data available
              </Box>
            </Box>
          }
          noMatch={
            <Box textAlign="center" color="inherit">
              <b>No matching data</b>
              <Box variant="p" color="inherit">
                There is no matching data to display
              </Box>
              <Button>Clear filter</Button>
            </Box>
          }
        />
      </SpaceBetween>
    </ColumnLayout>
  );

    return (
      <div>
        <br/>
        <Flashbar items={notifications} />
        <br/>
        <Container
          header={
            <div>
            <Header
              variant="h2"
              info={''}
              description={'All metrics on this page are served by static data for demo purposes.'}>
              Overview
            </Header>
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
              </SpaceBetween>
            </Box> 
            </div>
          }>
          <Summary />
        </Container>
        <br />
        <Container
          header={
            <Header
              variant="h2">
              Top toxic categories
            </Header>
          }>
          <SpaceBetween size="l">
          <ColumnLayout columns={2} variant="text-grid">
            <TopTextCategories />
            <TopImageCategories />
          </ColumnLayout>
          </SpaceBetween>
        </Container>
        <br />
        <Container
          header={
            <Header
              variant="h2">
              Toxicity over time
            </Header>
          }>
          <SpaceBetween size="l">
            <ToxicityOvertime />
          </SpaceBetween>
        </Container>
        <br />
        <Container
          header={
            <Header
              variant="h2">
              Top 10 toxic users
            </Header>
          }>
          <SpaceBetween size="l">
            <TopGamers />
          </SpaceBetween>
        </Container>
      </div>
    );
}