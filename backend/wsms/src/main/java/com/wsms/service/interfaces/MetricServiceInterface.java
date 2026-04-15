package com.wsms.service.interfaces;

import com.wsms.dto.metric.MetricResponse;
import com.wsms.dto.metric.MetricSubmitRequest;

import java.util.List;

public interface MetricServiceInterface {

    MetricResponse submitMetric(MetricSubmitRequest request);

    List<MetricResponse> getMetricsByServer(Long serverId, Long userId);

    List<MetricResponse> getRecentMetricsByServer(Long serverId, int hours, Long userId);
}
