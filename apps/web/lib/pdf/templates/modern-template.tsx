import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#f8fafc",
    padding: 0,
    position: "relative",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 120,
    backgroundColor: "#6366f1",
  },
  sidebarContent: {
    padding: 30,
    color: "#ffffff",
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    transform: "rotate(-90deg)",
    transformOrigin: "left top",
    position: "absolute",
    left: 60,
    top: 200,
  },
  container: {
    flex: 1,
    marginLeft: 140,
    padding: 60,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 30,
  },
  body: {
    marginBottom: 40,
  },
  awardText: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 20,
  },
  recipientName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 25,
  },
  description: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 12,
    lineHeight: 1.8,
    maxWidth: 550,
  },
  campaignInfo: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 15,
    fontStyle: "italic",
  },
  footer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 30,
    borderTop: "2pt solid #e2e8f0",
  },
  signature: {
    textAlign: "left",
  },
  signatureText: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 3,
  },
  signatureName: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "bold",
  },
  date: {
    fontSize: 10,
    color: "#94a3b8",
    position: "absolute",
    bottom: 30,
    right: 60,
  },
  badge: {
    position: "absolute",
    top: 50,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: "50%",
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

interface ModernTemplateProps {
  recipientName: string;
  title: string;
  description?: string;
  campaign?: string;
  issuedDate: string;
  issuerName?: string;
}

export function ModernTemplate({
  recipientName,
  title,
  description,
  campaign,
  issuedDate,
  issuerName = "CertifyRPG",
}: ModernTemplateProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarContent}>
            <Text style={styles.sidebarTitle}>CERTIFICATE</Text>
          </View>
        </View>

        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓</Text>
        </View>

        {/* Main content */}
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Certificado de Conquista</Text>
            <Text style={styles.subtitle}>
              Documento oficial de participação e realização
            </Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.awardText}>Este certificado é concedido a</Text>
            <Text style={styles.recipientName}>{recipientName}</Text>

            <Text style={styles.description}>{title}</Text>

            {description && (
              <Text style={styles.description}>{description}</Text>
            )}

            {campaign && (
              <Text style={styles.campaignInfo}>
                Campanha: {campaign}
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.signature}>
              <Text style={styles.signatureText}>Emitido por</Text>
              <Text style={styles.signatureName}>{issuerName}</Text>
              <Text style={styles.signatureText}>Game Master</Text>
            </View>

            <View style={styles.signature}>
              <Text style={styles.signatureText}>Data de emissão</Text>
              <Text style={styles.signatureName}>{issuedDate}</Text>
            </View>
          </View>

          <Text style={styles.date}>
            Powered by CertifyRPG • {new Date().toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
