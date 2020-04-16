import React, { useState } from 'react';

import Leaderboard from './components/Leaderboard';
import TxsActivityCell from './components/Leaderboard/cells/TxsActivity';
import Graph from './components/Graph';
import TotalStatTable from './components/TotalStatTable';
import Footer from './components/Footer';
import { makeLeaderboard, makeGraph } from './makeData';
import { useZonesStat, useTotalStat } from './hooks';
import PeriodSwitcher, { PERIODS } from './components/PeriodSwitcher';

function Map() {
  const [isTableOpened, setIsTableOpened] = useState(false);
  const [period, setPeriod] = useState(PERIODS[0]);
  const zones = useZonesStat({
    variables: { period: period.hours, step: period.step },
  });
  const { loading, error, data } = useTotalStat({
    variables: { period: period.hours, step: period.step },
  });

  console.log(data);

  const toggleTableOpen = (event) => {
    setIsTableOpened(event === 'open');
  };

  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        id: 'position',
        accessor: (originalRow, rowIndex) => rowIndex,
      },
      {
        Header: 'Zone',
        accessor: 'name',
      },
      {
        Header: 'Total IBC Txs',
        accessor: 'totalTxs',
        descr: 'A financial transaction is an agreement, or communication, carried out between a buyer and a seller to exchange an asset for payment.'
      },
      {
        Header: 'Total Txs',
        accessor: 'ibcAll',
        descr: 'A financial transaction is an agreement, or communication, carried out between a buyer and a seller to exchange an asset for payment.'
      },
      {
        Header: 'IBC share %',
        accessor: 'ibcPercentage',
      },
      {
        Header: 'IBC sent',
        accessor: 'ibcSent',
        descr: 'A financial transaction is an agreement, or communication, carried out between a buyer and a seller to exchange an asset for payment.'
      },
      {
        Header: 'IBC received',
        accessor: 'ibcReceived',
        descr: 'A financial transaction is an agreement, or communication, carried out between a buyer and a seller to exchange an asset for payment.'
      },
      {
        Header: 'Channels',
        accessor: 'connections',
        descr: 'A financial transaction is an agreement, or communication, carried out between a buyer and a seller to exchange an asset for payment.'
      },
      {
        Header: 'IBC txs activity',
        Cell: TxsActivityCell,
        accessor: 'txsActivity',
      },
    ],
    [],
  );
  const leaderboardData = React.useMemo(() => makeLeaderboard(2000), []);
  const graphData = React.useMemo(() => makeGraph(), []);

  if (!data) {
    return null; // TODO: Add spinner
  }

  return (
    <div>
      <TotalStatTable
        period={period.name}
        ibcTxsActivity={data.ibcTxsActivity}
        ibcTxs={data.ibcTxs}
        allZones={data.allZones}
        activeZones={data.activeZones}
        allChannels={data.allChannels}
        activeChannels={data.activeChannels}
        mostActiveZonesPair={data.mostActiveZonesPair}
        isTableOpened={isTableOpened}
      />
      <Graph data={graphData} isTableOpened={isTableOpened} toggleTableOpen={toggleTableOpen}/>
      <PeriodSwitcher hours={period.hours} onChange={setPeriod} />
      <Leaderboard columns={columns} data={leaderboardData} toggleTableOpen={(event)=>toggleTableOpen(event)}/>
      <Footer/>
    </div>
  );
}

export default Map;
