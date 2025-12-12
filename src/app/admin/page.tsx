import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { getPendingStaff } from '@/app/actions/admin';
import { getCurrentStaff } from '@/app/actions/diary';
import { redirect } from 'next/navigation';
import { ApproveButton } from '@/components/admin/ApproveButton';

export default async function AdminPage() {
  // 管理者権限チェック
  const currentStaff = await getCurrentStaff();
  
  if (!currentStaff) {
    redirect('/login');
  }

  // 管理者でない場合はトップページへリダイレクト
  if (currentStaff.system_role_id !== 1) {
    redirect('/');
  }

  // 承認待ちスタッフ一覧を取得
  const pendingStaff = await getPendingStaff();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        currentPoints={currentStaff.current_points || 0}
        systemRoleId={currentStaff.system_role_id}
      />
      
      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">スタッフ承認管理</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              新規登録申請の承認待ちスタッフ一覧
            </p>
          </CardHeader>
          
          <CardContent>
            {pendingStaff.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>承認待ちのスタッフはありません</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingStaff.map((staff) => (
                  <Card key={staff.staff_id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{staff.name}</h3>
                        <div className="mt-1 space-y-1 text-sm text-slate-600">
                          <p>メール: {staff.email}</p>
                          <p>職種: {staff.job_type?.job_name || '不明'}</p>
                          <p className="text-xs text-slate-400">
                            登録日: {new Date(staff.created_at).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <ApproveButton staffId={staff.staff_id} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

