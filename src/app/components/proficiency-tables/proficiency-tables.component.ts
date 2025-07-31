import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PROFICIENCY_TABLES, ProficiencyTable } from '../../models/proficiency-tables';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { medievalFontBase64 } from '../../services/medievalfont.js';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-proficiency-tables',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proficiency-tables.component.html',
  styleUrl: './proficiency-tables.component.scss',
})
export class ProficiencyTablesComponent implements OnInit {
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    // Track page view
    this.analyticsService.trackEvent('page_view', {
      page_title: 'Proficiency Tables',
      page_location: '/proficiency-tables',
    });
  }
  tables = PROFICIENCY_TABLES;
  vocations = [
    { key: 'knight', label: 'Knight' },
    { key: 'paladin', label: 'Paladin Xbow' },
    { key: 'outros', label: 'Outras vocações' },
  ];
  types = [
    { key: 'bosses', label: 'Bosses' },
    { key: 'criaturas', label: 'Criaturas' },
  ];

  selectedVocation = signal<'knight' | 'paladin' | 'outros'>('knight');
  selectedType = signal<'bosses' | 'criaturas'>('bosses');

  showExportModal = false;
  exportVocation: 'knight' | 'paladin' | 'outros' = 'knight';
  exportType: 'bosses' | 'criaturas' = 'bosses';
  exportAll = false;

  get filteredTable(): ProficiencyTable | undefined {
    return this.tables.find(
      t => t.vocation === this.selectedVocation() && t.type === this.selectedType()
    );
  }

  setVocation(v: string) {
    // Track vocation change
    this.analyticsService.trackEvent('proficiency_vocation_change', {
      vocation: v,
    });

    this.selectedVocation.set(v as 'knight' | 'paladin' | 'outros');
  }
  setType(t: string) {
    // Track type change
    this.analyticsService.trackEvent('proficiency_type_change', {
      type: t,
    });

    this.selectedType.set(t as 'bosses' | 'criaturas');
  }

  setExportVocation(v: string) {
    this.exportVocation = v as 'knight' | 'paladin' | 'outros';
    this.exportAll = false;
  }
  setExportType(t: string) {
    this.exportType = t as 'bosses' | 'criaturas';
    this.exportAll = false;
  }

  onExportAllChange(value: any) {
    this.exportAll = value === true || value === 'true';
  }

  // Método para formatar números no padrão brasileiro
  formatNumber(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const num = Number(value);
    if (isNaN(num)) {
      return String(value);
    }

    return num.toLocaleString('pt-BR');
  }

  exportPdf() {
    // Track PDF export
    this.analyticsService.trackEvent('proficiency_export', {
      export_type: 'pdf',
      export_all: this.exportAll,
      vocation: this.exportVocation,
      type: this.exportType,
      tables_count: this.exportAll ? this.tables.length : 1,
    });

    const exportAllBool = !!this.exportAll;
    const tablesToExport = exportAllBool
      ? this.tables
      : [
          this.tables.find(t => t.vocation === this.exportVocation && t.type === this.exportType),
        ].filter(Boolean);

    if (!tablesToExport.length) {
      alert('Nenhuma tabela encontrada para exportar!');
      this.showExportModal = false;
      return;
    }

    const doc = new jsPDF();
    doc.addFileToVFS('MedievalSharp-Book.ttf', medievalFontBase64);
    doc.addFont('MedievalSharp-Book.ttf', 'MedievalSharp', 'normal');
    doc.setFont('MedievalSharp', 'normal');
    let y = 20;
    tablesToExport.forEach((table, idx) => {
      if (!table) return;
      if (idx > 0) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(16);
      doc.text(table.title, 105, y, { align: 'center' });
      y += 10;
      autoTable(doc, {
        startY: y,
        head: [table.columns],
        body: table.rows.map(row => table.columns.map(col => row[col])),
        theme: 'grid',
        styles: {
          font: 'MedievalSharp',
          fontSize: 10,
          textColor: [60, 40, 20],
          lineColor: [160, 120, 70],
        },
        headStyles: {
          fillColor: [232, 217, 165],
          textColor: [60, 40, 20],
          lineWidth: 0.5,
          lineColor: [160, 120, 70],
        },
        alternateRowStyles: {
          fillColor: [253, 248, 228],
        },
        tableLineColor: [160, 120, 70],
        tableLineWidth: 0.5,
      });
    });
    doc.save(
      this.exportAll
        ? 'tabelas-proficiencia.pdf'
        : `tabela-${tablesToExport[0]?.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
    );
    this.showExportModal = false;
  }
}
