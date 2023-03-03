import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ColumnLayout,
  Container,
  Header,
  SpaceBetween,
  StatusIndicator,
} from '@cloudscape-design/components';
import { CounterLink } from './commons/common-components';
import BarChart from "@cloudscape-design/components/bar-chart";
import PieChart from "@cloudscape-design/components/pie-chart";
import LineChart from "@cloudscape-design/components/line-chart";

function constructBarData(obj) {
  var result =[]

  Object.keys(obj).forEach = (i, idx) => {
    console.log(i);

  }
  //console.log(result);
  return result;
}

export default () => {

   const [report, setReport] = useState(
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
    }
   );

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
          filterLabel: "Filter text category",
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
            { x: new Date(1601006400000), y: 110 },
            { x: new Date(1601007300000), y: 153 },
            { x: new Date(1601008200000), y: 182 },
            { x: new Date(1601009100000), y: 113 },
            { x: new Date(1601010000000), y: 124 },
            { x: new Date(1601010900000), y: 152 },
            { x: new Date(1601011800000), y: 198 },
            { x: new Date(1601012700000), y: 158 },
            { x: new Date(1601013600000), y: 103 },
            { x: new Date(1601014500000), y: 126 },
            { x: new Date(1601015400000), y: 110 },
            { x: new Date(1601016300000), y: 146 },
            { x: new Date(1601017200000), y: 183 },
            { x: new Date(1601018100000), y: 120 },
            { x: new Date(1601019000000), y: 168 },
            { x: new Date(1601019900000), y: 192 },
            { x: new Date(1601020800000), y: 245 },
            { x: new Date(1601021700000), y: 287 },
            { x: new Date(1601022600000), y: 220 },
            { x: new Date(1601023500000), y: 348 },
            { x: new Date(1601024400000), y: 292 },
            { x: new Date(1601025300000), y: 338 },
            { x: new Date(1601026200000), y: 362 },
            { x: new Date(1601027100000), y: 345 },
            { x: new Date(1601028000000), y: 342 },
            { x: new Date(1601028900000), y: 394 },
            { x: new Date(1601029800000), y: 447 },
            { x: new Date(1601030700000), y: 474 },
            { x: new Date(1601031600000), y: 463 },
            { x: new Date(1601032500000), y: 449 },
            { x: new Date(1601033400000), y: 452 },
            { x: new Date(1601034300000), y: 492 },
            { x: new Date(1601035200000), y: 530 }
          ],
          valueFormatter: function o(e) {
            return e.toFixed(2);
          }
        },
        {
          title: "Nudity",
          type: "line",
          data: [
            { x: new Date(1601006400000), y: 13 },
            { x: new Date(1601007300000), y: 18 },
            { x: new Date(1601008200000), y: 26 },
            { x: new Date(1601009100000), y: 20 },
            { x: new Date(1601010000000), y: 21 },
            { x: new Date(1601010900000), y: 26 },
            { x: new Date(1601011800000), y: 32 },
            { x: new Date(1601012700000), y: 38 },
            { x: new Date(1601013600000), y: 35 },
            { x: new Date(1601014500000), y: 39 },
            { x: new Date(1601015400000), y: 37 },
            { x: new Date(1601016300000), y: 45 },
            { x: new Date(1601017200000), y: 47 },
            { x: new Date(1601018100000), y: 48 },
            { x: new Date(1601019000000), y: 42 },
            { x: new Date(1601019900000), y: 50 },
            { x: new Date(1601020800000), y: 51 },
            { x: new Date(1601021700000), y: 52 },
            { x: new Date(1601022600000), y: 52 },
            { x: new Date(1601023500000), y: 54 },
            { x: new Date(1601024400000), y: 59 },
            { x: new Date(1601025300000), y: 58 },
            { x: new Date(1601026200000), y: 60 },
            { x: new Date(1601027100000), y: 64 },
            { x: new Date(1601028000000), y: 68 },
            { x: new Date(1601028900000), y: 62 },
            { x: new Date(1601029800000), y: 64 },
            { x: new Date(1601030700000), y: 65 },
            { x: new Date(1601031600000), y: 56 },
            { x: new Date(1601032500000), y: 50 },
            { x: new Date(1601033400000), y: 59 },
            { x: new Date(1601034300000), y: 63 },
            { x: new Date(1601035200000), y: 65 }
          ],
          valueFormatter: function o(e) {
            return e.toFixed(2);
          }
        },
        {
          title: "Hate speech",
          type: "line",
          data: [
            { x: new Date(1601006400000), y: 113 },
            { x: new Date(1601007300000), y: 118 },
            { x: new Date(1601008200000), y: 126 },
            { x: new Date(1601009100000), y: 120 },
            { x: new Date(1601010000000), y: 121 },
            { x: new Date(1601010900000), y: 126 },
            { x: new Date(1601011800000), y: 132 },
            { x: new Date(1601012700000), y: 138 },
            { x: new Date(1601013600000), y: 235 },
            { x: new Date(1601014500000), y: 119 },
            { x: new Date(1601015400000), y: 137 },
            { x: new Date(1601016300000), y: 145 },
            { x: new Date(1601017200000), y: 147 },
            { x: new Date(1601018100000), y: 248 },
            { x: new Date(1601019000000), y: 142 },
            { x: new Date(1601019900000), y: 150 },
            { x: new Date(1601020800000), y: 151 },
            { x: new Date(1601021700000), y: 152 },
            { x: new Date(1601022600000), y: 252 },
            { x: new Date(1601023500000), y: 254 },
            { x: new Date(1601024400000), y: 259 },
            { x: new Date(1601025300000), y: 158 },
            { x: new Date(1601026200000), y: 160 },
            { x: new Date(1601027100000), y: 164 },
            { x: new Date(1601028000000), y: 368 },
            { x: new Date(1601028900000), y: 362 },
            { x: new Date(1601029800000), y: 264 },
            { x: new Date(1601030700000), y: 265 },
            { x: new Date(1601031600000), y: 156 },
            { x: new Date(1601032500000), y: 150 },
            { x: new Date(1601033400000), y: 159 },
            { x: new Date(1601034300000), y: 163 },
            { x: new Date(1601035200000), y: 165 }
          ],
          valueFormatter: function o(e) {
            return e.toFixed(2);
          }
        },
        {
          title: "Profanity",
          type: "line",
          data: [
            { x: new Date(1601006400000), y: 413 },
            { x: new Date(1601007300000), y: 418 },
            { x: new Date(1601008200000), y: 426 },
            { x: new Date(1601009100000), y: 420 },
            { x: new Date(1601010000000), y: 521 },
            { x: new Date(1601010900000), y: 526 },
            { x: new Date(1601011800000), y: 532 },
            { x: new Date(1601012700000), y: 538 },
            { x: new Date(1601013600000), y: 635 },
            { x: new Date(1601014500000), y: 519 },
            { x: new Date(1601015400000), y: 637 },
            { x: new Date(1601016300000), y: 645 },
            { x: new Date(1601017200000), y: 647 },
            { x: new Date(1601018100000), y: 648 },
            { x: new Date(1601019000000), y: 612 },
            { x: new Date(1601019900000), y: 750 },
            { x: new Date(1601020800000), y: 751 },
            { x: new Date(1601021700000), y: 752 },
            { x: new Date(1601022600000), y: 752 },
            { x: new Date(1601023500000), y: 854 },
            { x: new Date(1601024400000), y: 859 },
            { x: new Date(1601025300000), y: 858 },
            { x: new Date(1601026200000), y: 960 },
            { x: new Date(1601027100000), y: 964 },
            { x: new Date(1601028000000), y: 968 },
            { x: new Date(1601028900000), y: 962 },
            { x: new Date(1601029800000), y: 964 },
            { x: new Date(1601030700000), y: 865 },
            { x: new Date(1601031600000), y: 856 },
            { x: new Date(1601032500000), y: 950 },
            { x: new Date(1601033400000), y: 959 },
            { x: new Date(1601034300000), y: 1063 },
            { x: new Date(1601035200000), y: 1165 }
          ],
          valueFormatter: function o(e) {
            return e.toFixed(2);
          }
        }
      ]}
      xDomain={[
        new Date(1601006400000),
        new Date(1601035200000)
      ]}
      yDomain={[0, 1500]}
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
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: !1
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
        <Container
          header={
            <div>
            <Header
              variant="h2"
              info={''}>
              Trust & Safety overview
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