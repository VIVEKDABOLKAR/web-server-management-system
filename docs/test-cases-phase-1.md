# Web Server Management System - Phase 1 Test Cases

## Test Case Format
- Test ID
- Test Condition
- Expected Output
- Actual Output
- Remark

> Note: The "Actual Output" column is set to "Not executed yet" because this document is being created as test-case documentation.

## 1. Admin Signup

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| SGN-01 | Register with valid email, unique username, and strong password | Admin account is created and verification email is sent | Not executed yet | Positive case |
| SGN-02 | Register with duplicate username or email | System shows duplicate account error and does not create the account | Not executed yet | Validation case |
| SGN-03 | Register with invalid email format or weak password | System blocks submission and shows validation message | Not executed yet | Input validation |

## 2. Admin Login

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| LGN-01 | Login with verified account and correct password | Admin is authenticated and redirected to dashboard | Not executed yet | Positive case |
| LGN-02 | Login with correct credentials but unverified account | System denies access and requests verification | Not executed yet | Verification check |
| LGN-03 | Login with wrong password | System shows invalid credential message | Not executed yet | Authentication failure |

## 3. Admin Dashboard (Basic)

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| DSH-01 | Open dashboard after successful login | Dashboard loads summary cards and main widgets | Not executed yet | Initial page load |
| DSH-02 | WebSocket connection is active | Dashboard receives real-time updates without refresh | Not executed yet | Real-time update |
| DSH-03 | Server and IP data exist in backend | Summary cards show correct counts | Not executed yet | Data consistency |

## 4. Add Server (Server Onboarding)

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| SRV-01 | Add server with valid name, IP, and type | Server is saved with Inactive status | Not executed yet | Positive case |
| SRV-02 | Add server with invalid IP format | System rejects the form and shows error | Not executed yet | Validation case |
| SRV-03 | Add server with duplicate IP address | System blocks duplicate server creation | Not executed yet | Uniqueness check |

## 5. Install Monitoring Agent on Server

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| AGT-01 | Generate installation command for a valid server | Script/command includes server ID and auth token | Not executed yet | Script generation |
| AGT-02 | Run installation command on target server | Agent registers successfully with backend | Not executed yet | Registration flow |
| AGT-03 | Use invalid or expired auth token | Backend rejects registration and keeps server inactive | Not executed yet | Security validation |

## 6. Server Health Monitoring (CPU & Memory)

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| MTR-01 | Agent sends CPU and memory metrics within interval | Backend stores and forwards latest metrics | Not executed yet | Normal data flow |
| MTR-02 | CPU usage exceeds threshold | Dashboard shows high/critical CPU state | Not executed yet | Threshold case |
| MTR-03 | Memory usage exceeds threshold | Dashboard shows high/critical memory state | Not executed yet | Threshold case |

## 7. Server Details Page

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| DTL-01 | Open an active server from dashboard | Server details page loads correct server information | Not executed yet | Navigation case |
| DTL-02 | Server has recent heartbeat data | Last heartbeat time is displayed correctly | Not executed yet | Data display |
| DTL-03 | Live metrics are available | CPU and memory gauges update in real time | Not executed yet | Live update |

## 8. Traffic & Request Analytics (Basic)

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| TRF-01 | Agent sends request count and RPS data | Traffic metrics are stored and displayed | Not executed yet | Positive case |
| TRF-02 | Select last 1 hour filter | Chart updates to show 1 hour traffic history | Not executed yet | Time filter |
| TRF-03 | Select last 24 hours filter | Chart updates to show 24 hour traffic history | Not executed yet | Time filter |

## 9. User / IP Tracking (Basic)

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| IPT-01 | Incoming request arrives from a new IP | IP is stored with request count and timestamp | Not executed yet | Tracking case |
| IPT-02 | Same IP sends multiple requests | Request count for that IP increases correctly | Not executed yet | Count update |
| IPT-03 | Multiple IPs generate traffic | Dashboard shows each IP separately in the list | Not executed yet | Multi-record check |

## 10. IP Block / Unblock (Manual)

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| BLK-01 | Admin blocks an IP from the list | IP is saved as blocked and agent receives update | Not executed yet | Positive case |
| BLK-02 | Agent receives blocked IP list | Matching traffic from blocked IP is rejected | Not executed yet | Enforcement case |
| BLK-03 | Admin unblocks a previously blocked IP | IP is removed from blocked list and traffic is allowed again | Not executed yet | Reversal case |

## 11. Basic Alerts (Threshold-Based)

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| ALT-01 | CPU or memory exceeds threshold | Alert is created and marked active | Not executed yet | Threshold alert |
| ALT-02 | RPS exceeds configured limit | Alert appears on dashboard with correct server ID | Not executed yet | Traffic alert |
| ALT-03 | Metrics remain below thresholds | No alert is generated | Not executed yet | Negative case |

## 12. Logout

| Test ID | Test Condition | Expected Output | Actual Output | Remark |
| --- | --- | --- | --- | --- |
| LGO-01 | Admin clicks logout button | Session/token is invalidated and user is redirected to login page | Not executed yet | Positive case |
| LGO-02 | User tries to open dashboard after logout | Access is denied and login page is shown | Not executed yet | Session validation |
| LGO-03 | Logout request is repeated with expired token | System handles request safely without exposing dashboard data | Not executed yet | Security case |
