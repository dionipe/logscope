const express = require('express');
const router = express.Router();
const logAnalyzer = require('../utils/logAnalyzer');

// Home page - Dashboard
router.get('/', (req, res) => {
    const logs = global.logStorage.getLogs({ limit: 10000 });
    const stats = logAnalyzer.getStatistics(logs);
    res.render('index', {
        title: 'Dashboard - LogScope',
        page: 'dashboard',
        stats: stats,
        syslogPort: process.env.SYSLOG_PORT || 1514
    });
});

// Syslog Configuration page
router.get('/config', (req, res) => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    const serverIPs = [];
    
    // Get all network interfaces IPs
    Object.keys(networkInterfaces).forEach(interfaceName => {
        networkInterfaces[interfaceName].forEach(iface => {
            if (iface.family === 'IPv4' && !iface.internal) {
                serverIPs.push(iface.address);
            }
        });
    });
    
    res.render('config', { 
        title: 'Syslog Configuration - LogScope',
        page: 'config',
        serverIPs: serverIPs,
        syslogPort: process.env.SYSLOG_PORT || 514
    });
});

// Analysis page
router.get('/analysis', (req, res) => {
    res.render('analysis', { 
        title: 'Log Analysis - LogScope',
        page: 'analysis'
    });
});

module.exports = router;
