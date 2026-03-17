from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.units import inch
import io

def generate_pdf_report(tender_data, analysis_result):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor("#06b6d4"),
        spaceAfter=20,
        alignment=1 # Center
    )
    
    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor("#334155"),
        spaceBefore=15,
        spaceAfter=10,
        borderPadding=5,
        borderWidth=1,
        borderColor=colors.HexColor("#e2e8f0"),
        backColor=colors.HexColor("#f8fafc")
    )

    label_style = ParagraphStyle('Label', parent=styles['Normal'], fontSize=10, textColor=colors.grey, spaceAfter=2)
    value_style = ParagraphStyle('Value', parent=styles['Normal'], fontSize=12, textColor=colors.black, spaceAfter=10, weight='bold')
    
    elements = []

    # Header
    elements.append(Paragraph("TenderSync Business Intelligence Report", title_style))
    elements.append(Paragraph(f"Tender ID: {tender_data.get('tender_id', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"Export Date: 2026-03-17", styles['Normal']))
    elements.append(Spacer(1, 0.5 * inch))

    # Project Overview
    elements.append(Paragraph("1. Project Overview", section_style))
    elements.append(Paragraph(f"<b>Title:</b> {tender_data.get('title', 'N/A')}", styles['Normal']))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(f"<b>Description:</b>", styles['Normal']))
    elements.append(Paragraph(tender_data.get('description', 'N/A'), styles['Normal']))
    elements.append(Spacer(1, 20))

    # P&L Analysis
    elements.append(Paragraph("2. Financial Profit & Loss Analysis", section_style))
    pnl = analysis_result.get('profit_analysis', {})
    
    data = [
        ["Metric", "Value"],
        ["Estimated Revenue", pnl.get('estimated_revenue', 'N/A')],
        ["Estimated Total Costs", pnl.get('estimated_costs', 'N/A')],
        ["Net Profit Margin", pnl.get('net_profit_margin', 'N/A')]
    ]
    
    t = Table(data, colWidths=[2.5*inch, 3*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Financial Summary:</b>", styles['Normal']))
    elements.append(Paragraph(pnl.get('summary', 'N/A'), styles['Normal']))
    elements.append(Spacer(1, 20))

    # Risk Assessment
    elements.append(Paragraph("3. Risk & Feasibility Audit", section_style))
    risk = analysis_result.get('risk_assessment', {})
    elements.append(Paragraph(f"<b>Feasibility Rank:</b> {risk.get('feasibility', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"<b>Overall Risk Score:</b> {risk.get('detailed_score', 0)}/100", styles['Normal']))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Primary Risk Factors:</b>", styles['Normal']))
    for factor in risk.get('risk_factors', []):
        elements.append(Paragraph(f"• {factor}", styles['Normal']))
    
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Gap Analysis & Mitigation:</b>", styles['Normal']))
    elements.append(Paragraph(risk.get('gap_analysis', 'N/A'), styles['Normal']))
    elements.append(Spacer(1, 20))

    # Comparison Table
    elements.append(PageBreak())
    elements.append(Paragraph("4. Technical Requirement Comparison", section_style))
    comp_data = [["Government Requirement", "User Capability", "Status", "Impact"]]
    
    for item in analysis_result.get('comparison', []):
        comp_data.append([
            item.get('requirement', ''),
            item.get('user_data', ''),
            item.get('status', ''),
            item.get('impact', '')
        ])
    
    ct = Table(comp_data, colWidths=[1.8*inch, 1.8*inch, 0.8*inch, 1.2*inch])
    ct.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#334155")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 1), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
    ]))
    elements.append(ct)

    # Footer
    elements.append(Spacer(1, 0.5 * inch))
    elements.append(Paragraph("<i>This report is AI-generated and intended for strategic decision support. Please verify all financial figures manually.</i>", styles['Normal']))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
