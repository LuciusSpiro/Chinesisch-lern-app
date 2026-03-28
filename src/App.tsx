import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { VokabelPage } from './pages/VokabelPage'
import { AbmalPage } from './pages/AbmalPage'
import { SchreibPage } from './pages/SchreibPage'
import { StrichLernPage } from './pages/StrichLernPage'
import { SpieleHubPage } from './pages/SpieleHubPage'
import { MemoryPage } from './pages/MemoryPage'
import { RadikalPage } from './pages/RadikalPage'
import { SatzbauPage } from './pages/SatzbauPage'
import { LueckentextPage } from './pages/LueckentextPage'
import { LernenPage } from './pages/LernenPage'
import { SternVokabelPage } from './pages/SternVokabelPage'
import { SternZeichnenPage } from './pages/SternZeichnenPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lernen" element={<LernenPage />} />
          <Route path="/trainer" element={<VokabelPage />} />
          <Route path="/striche" element={<StrichLernPage />} />
          <Route path="/abmalen" element={<AbmalPage />} />
          <Route path="/schreiben" element={<SchreibPage />} />
          <Route path="/spiele" element={<SpieleHubPage />} />
          <Route path="/spiele/memory" element={<MemoryPage />} />
          <Route path="/spiele/radikale" element={<RadikalPage />} />
          <Route path="/spiele/satzbau" element={<SatzbauPage />} />
          <Route path="/spiele/lueckentext" element={<LueckentextPage />} />
          <Route path="/spiele/stern-vokabeln" element={<SternVokabelPage />} />
          <Route path="/spiele/stern-zeichen" element={<SternZeichnenPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
