/**
 * Pure domain checks for topic editorial actions.
 * Inputs are read inside the same database transaction as any later mutation.
 * NOT authorization: the API separately requires AAL2 and an active FIB editor/admin.
 */
export function decideTopicAction(action, state) {
  const { topicStatus, everPublished, hasActivePublication, approvedVersion,
    approvalEverPublished, approvalRevoked, unchangedContent, currencyCheckConfirmed,
    explicitConfirmation } = state;
  const fail = reason => ({ allowed: false, reason });
  const ok = resultStatus => ({ allowed: true, resultStatus });

  switch (action) {
    case 'approve':
      if (!state.body?.trim()) return fail('empty_contribution');
      if (approvedVersion && !approvalRevoked) return fail('already_approved');
      return ok(topicStatus === 'draft' ? 'active' : topicStatus);
    case 'revoke':
      if (!approvedVersion || approvalRevoked) return fail('no_active_approval');
      if (approvalEverPublished) return fail('published_approval_immutable');
      return ok(topicStatus === 'active' && !everPublished ? 'draft' : topicStatus);
    case 'publish':
      if (!approvedVersion || approvalRevoked) return fail('approval_required');
      if (topicStatus !== 'active') return fail('topic_not_active');
      if (!explicitConfirmation) return fail('explicit_confirmation_required');
      return ok(topicStatus);
    case 'defer':
    case 'archive':
      if (topicStatus === 'draft' && action === 'defer') return fail('draft_cannot_be_deferred');
      if (!explicitConfirmation) return fail('explicit_confirmation_required');
      return ok(action === 'defer' ? 'deferred' : 'archived');
    case 'reactivate':
      if (!['deferred','archived'].includes(topicStatus)) return fail('topic_not_inactive');
      if (!explicitConfirmation || !currencyCheckConfirmed) return fail('currency_check_required');
      if (!unchangedContent && !state.newContentApproved) return fail('new_approval_required');
      return ok('active'); // does not publish by itself
    case 'delete':
      if (everPublished) return fail('published_topic_cannot_be_deleted');
      if (approvedVersion && !approvalRevoked) return fail('active_approval_blocks_delete');
      if (!explicitConfirmation) return fail('explicit_confirmation_required');
      return ok('deleted');
    default:
      return fail('unknown_action');
  }
}
