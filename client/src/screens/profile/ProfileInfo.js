import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { PieChart, Pie, Tooltip } from 'recharts';
import apiClient from '../../utils/apiClient';

// ###################################################################
const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 },
];

const data02 = [
  { name: 'Group A', value: 2400 },
  { name: 'Group B', value: 4567 },
  { name: 'Group C', value: 1398 },
  { name: 'Group D', value: 9800 },
  { name: 'Group E', value: 3908 },
  { name: 'Group F', value: 4800 },
];

function AllPetsPie() {
  return (
    <PieChart width={400} height={400}>
      <Pie
        dataKey='value'
        isAnimationActive={false}
        data={data01}
        cx={200}
        cy={200}
        outerRadius={80}
        fill='#8884d8'
        label
      />
      <Pie dataKey='value' data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill='blue' />
      <Tooltip />
    </PieChart>
  );
}
// ###################################################################

function ProfileInfo() {
  const colors = ['blue', 'orange', 'green'];
  const [countsList, setCountsList] = useState([]);

  useEffect(() => {
    async function fetcher() {
      try {
        const names = ['Posted Count', 'Liked Count', 'Adopted Count'];
        const results = await Promise.all([
          apiClient.head('user/pets'),
          apiClient.head('user/pets/liked'),
          apiClient.head('user/pets/adopted'),
        ]);
        const list = results.map((x, idx) => ({ name: names[idx], count: +x.headers['x-total-count'] }));
        setCountsList(list);
      } catch (err) {
        console.error(err);
      }
    }
    fetcher();
  }, []);

  return (
    <div>
      <div>
        <Row gutter={{ xs: 6, sm: 12, md: 18, lg: 32 }} style={{ display: 'flex', justifyContent: 'center' }}>
          {countsList.map(({ name, count }, idx) => (
            <Col key={name} span={8} style={{ maxWidth: 300 }}>
              <Card>
                <Statistic title={name} value={count} valueStyle={{ color: colors[idx] }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <AllPetsPie />
    </div>
  );
}

export default ProfileInfo;
